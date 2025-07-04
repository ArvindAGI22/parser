import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import axios from 'axios';

function isServerless() {
  return !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL || !!process.env.NETLIFY;
}

export async function scrapePortfolio(portfolioUrl: string) {
  // Serverless fallback: use axios + cheerio only
  if (isServerless()) {
    try {
      const resp = await axios.get(portfolioUrl, { timeout: 10000 });
      const $ = cheerio.load(resp.data);
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      const techKeywords = extractTechKeywords(text);
      return {
        text: text.substring(0, 2000),
        links: $('a').map((_, el) => $(el).attr('href')).get(),
        techKeywords,
        title: $('title').text(),
      };
    } catch (err) {
      console.error('Serverless portfolio fetch failed:', err);
      return {
        text: '',
        links: [],
        techKeywords: [],
        title: '',
      };
    }
  }

  // Playwright path for full Node environment
  const browser = await chromium.launch({ args: ['--no-sandbox'] }).catch(() => null);
  if (!browser) {
    return {
      text: '',
      links: [],
      techKeywords: [],
      title: '',
    };
  }
  const page = await browser.newPage();
  try {
    await page.goto(portfolioUrl, { waitUntil: 'networkidle' });
    const content = await page.content();
    const $ = cheerio.load(content);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    const links = $('a').map((_, el) => $(el).attr('href')).get();
    const techKeywords = extractTechKeywords(text);
    await browser.close();
    return {
      text: text.substring(0, 2000),
      links,
      techKeywords,
      title: $('title').text(),
    };
  } catch (error) {
    await browser.close();
    console.error('Scraping error:', error);
    return {
      text: '',
      links: [],
      techKeywords: [],
      title: '',
    };
  }
}

function extractTechKeywords(text: string): string[] {
  const techStack = [
    'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'JavaScript',
    'TypeScript', 'GraphQL', 'REST', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Docker', 'AWS', 'Firebase', 'Vercel', 'Tailwind', 'Bootstrap'
  ];
  return techStack.filter(tech => text.toLowerCase().includes(tech.toLowerCase()));
} 