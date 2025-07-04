import { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';
import { generateDetailedEvalPrompt } from '../../utils/prompts';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { baseEval, recruiterPreferences } = req.body;

    // Generate dynamic prompt based on recruiter preferences
    const dynamicPrompt = generateDetailedEvalPrompt(recruiterPreferences);
    
    // Replace placeholders with actual data
    const finalPrompt = dynamicPrompt.replace('{baseEval}', JSON.stringify(baseEval));

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: finalPrompt
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
    console.error('Detailed evaluation error:', error);
    res.status(500).json({ error: 'Failed to evaluate candidate' });
  }
} 