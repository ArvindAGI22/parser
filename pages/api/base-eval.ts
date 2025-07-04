import { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';
import { fetchGitHubData } from '../../utils/github';
import { scrapePortfolio } from '../../utils/scraper';
import { BASE_EVAL_PROMPT } from '../../utils/prompts';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Debug log for env variable
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { githubUrl, portfolioUrl } = req.body;

    // Fetch GitHub data
    const githubData = await fetchGitHubData(githubUrl);
    
    // Scrape portfolio
    const portfolioData = await scrapePortfolio(portfolioUrl);
    
    // Prepare data for LLM
    const candidateData = {
      github: {
        username: githubData.profile.login,
        repos: githubData.repositories,
        totalRepos: githubData.totalRepos,
        followers: githubData.profile.followers
      },
      portfolio: {
        title: portfolioData.title,
        content: portfolioData.text,
        techKeywords: portfolioData.techKeywords
      }
    };

    // Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: BASE_EVAL_PROMPT.replace('{candidateData}', JSON.stringify(candidateData))
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
    });

    // Extract JSON block from LLM response
    let content = completion.choices[0].message.content || '{}';
    const match = content.match(/{[\s\S]*}/);
    if (match) {
      content = match[0];
    }
    const evaluation = JSON.parse(content);
    
    res.status(200).json({
      ...evaluation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Base evaluation error:', error);
    res.status(500).json({ error: 'Failed to evaluate candidate' });
  }
} 