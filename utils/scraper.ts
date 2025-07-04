import { chromium } from 'playwright';
import * as cheerio from 'cheerio';

export async function scrapePortfolio(portfolioUrl: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(portfolioUrl, { waitUntil: 'networkidle' });
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Extract text content
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Extract links and technologies
    const links = $('a').map((_, el) => $(el).attr('href')).get();
    const techKeywords = extractTechKeywords(text);
    
    await browser.close();
    
    return {
      text: text.substring(0, 2000), // Limit text length
      links,
      techKeywords,
      title: $('title').text()
    };
  } catch (error) {
    await browser.close();
    throw new Error(`Scraping error: ${error}`);
  }
}

function extractTechKeywords(text: string): string[] {
  const techStack = [
    'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'JavaScript',
    'TypeScript', 'GraphQL', 'REST', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Docker', 'AWS', 'Firebase', 'Vercel', 'Tailwind', 'Bootstrap'
  ];
  
  return techStack.filter(tech => 
    text.toLowerCase().includes(tech.toLowerCase())
  );
} 