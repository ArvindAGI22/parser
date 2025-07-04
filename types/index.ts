export interface BaseEvaluation {
  summary: string;
  scores: {
    githubActivity: number;
    codeQuality: number;
    techDepth: number;
    designPortfolio: number;
  };
  suggestedRoles: string[];
  redFlags?: string[];
  timestamp: string;
}

export interface DetailedEvaluation {
  matchScore: number;
  matchingSkills: string[];
  gaps: string[];
  finalVerdict: string;
  timestamp: string;
}

export interface RecruiterPreferences {
  roleType: string;
  experienceLevel: string;
  companyType: string;
  evaluationStyle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  dealBreakers: string[];
  keyFocus: string[];
  customCriteria: string;
}

export interface CandidateData {
  githubUrl: string;
  portfolioUrl: string;
  baseEval?: BaseEvaluation;
  detailedEval?: DetailedEvaluation;
  recruiterPreferences?: RecruiterPreferences;
} 