import { RecruiterPreferences } from '../types';

export const BASE_EVAL_PROMPT = `
You are an expert technical recruiter evaluating a candidate based on their GitHub and portfolio.

Given the information below, provide a structured evaluation:

CANDIDATE DATA:
{candidateData}

Return ONLY valid JSON, with no explanation or preamble. The JSON should have:
1. summary: 3-4 sentence overview of the candidate
2. scores: Object with githubActivity, codeQuality, techDepth, designPortfolio (all out of 10)
3. suggestedRoles: Array of 2-3 job roles that fit this candidate
4. redFlags: Array of any concerning patterns (optional)

Be concise but thorough. Focus on technical capabilities and professional readiness.
`;

export function generateDetailedEvalPrompt(preferences: RecruiterPreferences): string {
  const {
    roleType,
    experienceLevel,
    companyType,
    evaluationStyle,
    requiredSkills,
    preferredSkills,
    dealBreakers,
    keyFocus,
    customCriteria
  } = preferences;

  let prompt = `You are an expert technical recruiter evaluating a candidate for a specific role.

EVALUATION CONTEXT:
- Role Type: ${roleType}
- Experience Level: ${experienceLevel}
- Company Type: ${companyType}
- Evaluation Style: ${evaluationStyle}

CANDIDATE'S BASE EVALUATION:
{baseEval}

REQUIREMENTS:`;

  if (requiredSkills.length > 0) {
    prompt += `
- Required Skills: ${requiredSkills.join(', ')}`;
  }

  if (preferredSkills.length > 0) {
    prompt += `
- Preferred Skills: ${preferredSkills.join(', ')}`;
  }

  if (dealBreakers.length > 0) {
    prompt += `
- Deal Breakers: ${dealBreakers.join(', ')}`;
  }

  if (keyFocus.length > 0) {
    prompt += `
- Key Focus Areas: ${keyFocus.join(', ')}`;
  }

  if (customCriteria) {
    prompt += `
- Additional Criteria: ${customCriteria}`;
  }

  // Add evaluation style guidance
  prompt += `

EVALUATION STYLE GUIDANCE:`;
  
  switch (evaluationStyle) {
    case 'Conservative':
      prompt += `
- Be strict in your evaluation
- Focus on proven experience and skills
- Highlight any gaps or concerns
- Require strong evidence for high scores`;
      break;
    case 'Optimistic':
      prompt += `
- Give candidates benefit of the doubt
- Focus on potential and transferable skills
- Be generous with interpretations
- Emphasize growth mindset`;
      break;
    case 'Balanced':
    default:
      prompt += `
- Provide fair and objective assessment
- Balance strengths and weaknesses
- Consider both current skills and potential
- Be realistic about fit`;
  }

  // Add company type considerations
  prompt += `

COMPANY CONTEXT:`;
  
  switch (companyType) {
    case 'Startup':
      prompt += `
- Value versatility and adaptability
- Look for self-starters and quick learners
- Consider ability to wear multiple hats
- Emphasize problem-solving and innovation`;
      break;
    case 'Enterprise':
      prompt += `
- Value depth of experience and specialization
- Look for proven track record at scale
- Consider collaboration and process adherence
- Emphasize reliability and best practices`;
      break;
    case 'Agency':
      prompt += `
- Value client-facing skills and communication
- Look for diverse project experience
- Consider ability to context-switch quickly
- Emphasize quality and deadline management`;
      break;
    default:
      prompt += `
- Consider general software development best practices
- Look for well-rounded technical skills
- Evaluate problem-solving approach`;
  }

  // Add experience level expectations
  prompt += `

EXPERIENCE LEVEL EXPECTATIONS:`;
  
  switch (experienceLevel) {
    case 'Junior (0-2 years)':
      prompt += `
- Focus on foundational skills and learning potential
- Value education, personal projects, and enthusiasm
- Don't expect deep production experience
- Look for curiosity and growth mindset`;
      break;
    case 'Mid-level (3-5 years)':
      prompt += `
- Expect solid technical skills and some production experience
- Look for ability to work independently
- Value problem-solving and debugging skills
- Consider leadership potential`;
      break;
    case 'Senior (6+ years)':
      prompt += `
- Expect deep technical expertise and architecture skills
- Look for mentorship and leadership experience
- Value system design and scaling experience
- Consider business impact and strategic thinking`;
      break;
    case 'Lead/Staff (8+ years)':
      prompt += `
- Expect exceptional technical leadership
- Look for cross-team collaboration and influence
- Value technical decision-making and vision
- Consider org-level impact and mentoring`;
      break;
  }

  prompt += `

Return ONLY valid JSON, with no explanation or preamble. The JSON should have:
1. matchScore: Number 1-10 (how well they match the requirements)
2. matchingSkills: Array of skills that align with requirements
3. gaps: Array of missing skills or areas for improvement
4. finalVerdict: 2-sentence recommendation considering the role and company context

Focus on the specific requirements and context provided. Be honest about fit while considering the evaluation style requested.`;

  return prompt;
} 