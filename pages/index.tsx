import React, { useState, useEffect } from 'react';
import { CandidateData, RecruiterPreferences } from '../types';

const DEFAULT_PREFERENCES: RecruiterPreferences = {
  roleType: 'Full-Stack Developer',
  experienceLevel: 'Mid-level (3-5 years)',
  companyType: 'Startup',
  evaluationStyle: 'Balanced',
  requiredSkills: [],
  preferredSkills: [],
  dealBreakers: [],
  keyFocus: [],
  customCriteria: ''
};

export default function Home() {
  const [candidateData, setCandidateData] = useState<CandidateData>({
    githubUrl: '',
    portfolioUrl: '',
    recruiterPreferences: DEFAULT_PREFERENCES
  });
  const [loading, setLoading] = useState({ base: false, detailed: false });
  const [showPreferences, setShowPreferences] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('candidateData');
    if (saved) {
      const savedData = JSON.parse(saved);
      setCandidateData({
        ...savedData,
        recruiterPreferences: { ...DEFAULT_PREFERENCES, ...savedData.recruiterPreferences }
      });
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('candidateData', JSON.stringify(candidateData));
  }, [candidateData]);

  const runBaseEvaluation = async () => {
    setLoading({ ...loading, base: true });
    
    try {
      const response = await fetch('/api/base-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUrl: candidateData.githubUrl,
          portfolioUrl: candidateData.portfolioUrl
        })
      });
      
      const baseEval = await response.json();
      setCandidateData({ ...candidateData, baseEval });
    } catch (error) {
      alert('Error running base evaluation');
    } finally {
      setLoading({ ...loading, base: false });
    }
  };

  const runDetailedEvaluation = async () => {
    setLoading({ ...loading, detailed: true });
    
    try {
      const response = await fetch('/api/detailed-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseEval: candidateData.baseEval,
          recruiterPreferences: candidateData.recruiterPreferences
        })
      });
      
      const detailedEval = await response.json();
      setCandidateData({ ...candidateData, detailedEval });
    } catch (error) {
      alert('Error running detailed evaluation');
    } finally {
      setLoading({ ...loading, detailed: false });
    }
  };

  const clearEvaluation = () => {
    setCandidateData({
      githubUrl: '',
      portfolioUrl: '',
      recruiterPreferences: DEFAULT_PREFERENCES
    });
    localStorage.removeItem('candidateData');
  };

  const updatePreferences = (field: keyof RecruiterPreferences, value: any) => {
    setCandidateData({
      ...candidateData,
      recruiterPreferences: {
        ...candidateData.recruiterPreferences!,
        [field]: value
      }
    });
  };

  const addSkill = (field: 'requiredSkills' | 'preferredSkills' | 'dealBreakers' | 'keyFocus', skill: string) => {
    if (skill.trim()) {
      const currentSkills = candidateData.recruiterPreferences![field] as string[];
      if (!currentSkills.includes(skill.trim())) {
        updatePreferences(field, [...currentSkills, skill.trim()]);
      }
    }
  };

  const removeSkill = (field: 'requiredSkills' | 'preferredSkills' | 'dealBreakers' | 'keyFocus', skill: string) => {
    const currentSkills = candidateData.recruiterPreferences![field] as string[];
    updatePreferences(field, currentSkills.filter(s => s !== skill));
  };

  const SkillInput = ({ 
    field, 
    label, 
    placeholder 
  }: { 
    field: 'requiredSkills' | 'preferredSkills' | 'dealBreakers' | 'keyFocus',
    label: string,
    placeholder: string
  }) => {
    const [inputValue, setInputValue] = useState('');
    const skills = candidateData.recruiterPreferences![field] as string[];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSkill(field, inputValue);
                setInputValue('');
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => {
              addSkill(field, inputValue);
              setInputValue('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(field, skill)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎯 Technical Recruiter Evaluation Tool
        </h1>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Candidate Links</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={candidateData.githubUrl}
                onChange={(e) => setCandidateData({ ...candidateData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL
              </label>
              <input
                type="url"
                value={candidateData.portfolioUrl}
                onChange={(e) => setCandidateData({ ...candidateData, portfolioUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://candidate-portfolio.com"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={runBaseEvaluation}
                disabled={loading.base || !candidateData.githubUrl || !candidateData.portfolioUrl}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.base ? 'Evaluating...' : 'Run Base Evaluation'}
              </button>
              
              <button
                onClick={clearEvaluation}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Clear Evaluation
              </button>
            </div>
          </div>
        </div>

        {/* Base Evaluation Results */}
        {candidateData.baseEval && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">📊 Base Evaluation</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Summary</h3>
              <p className="text-gray-700">{candidateData.baseEval.summary}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Baseline Scorecard</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">GitHub Activity</td>
                      <td className="border border-gray-300 px-4 py-2">{candidateData.baseEval?.scores?.githubActivity !== undefined ? candidateData.baseEval.scores.githubActivity + '/10' : '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Code Quality</td>
                      <td className="border border-gray-300 px-4 py-2">{candidateData.baseEval?.scores?.codeQuality !== undefined ? candidateData.baseEval.scores.codeQuality + '/10' : '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Tech Depth</td>
                      <td className="border border-gray-300 px-4 py-2">{candidateData.baseEval?.scores?.techDepth !== undefined ? candidateData.baseEval.scores.techDepth + '/10' : '-'}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Design/Portfolio</td>
                      <td className="border border-gray-300 px-4 py-2">{candidateData.baseEval?.scores?.designPortfolio !== undefined ? candidateData.baseEval.scores.designPortfolio + '/10' : '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Suggested Roles</h3>
              <div className="flex flex-wrap gap-2">
                {candidateData.baseEval.suggestedRoles.map((role, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            
            {candidateData.baseEval.redFlags && candidateData.baseEval.redFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-red-600">Red Flags</h3>
                <ul className="list-disc pl-5 text-red-700">
                  {candidateData.baseEval.redFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Recruiter Preferences */}
        {candidateData.baseEval && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">⚙️ Evaluation Preferences</h2>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showPreferences ? 'Hide' : 'Show'} Preferences
              </button>
            </div>
            
            {showPreferences && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Type</label>
                    <select
                      value={candidateData.recruiterPreferences!.roleType}
                      onChange={(e) => updatePreferences('roleType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Frontend Developer</option>
                      <option>Backend Developer</option>
                      <option>Full-Stack Developer</option>
                      <option>DevOps Engineer</option>
                      <option>Mobile Developer</option>
                      <option>Data Engineer</option>
                      <option>ML Engineer</option>
                      <option>Technical Lead</option>
                      <option>Solution Architect</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={candidateData.recruiterPreferences!.experienceLevel}
                      onChange={(e) => updatePreferences('experienceLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Junior (0-2 years)</option>
                      <option>Mid-level (3-5 years)</option>
                      <option>Senior (6+ years)</option>
                      <option>Lead/Staff (8+ years)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                    <select
                      value={candidateData.recruiterPreferences!.companyType}
                      onChange={(e) => updatePreferences('companyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Startup</option>
                      <option>Enterprise</option>
                      <option>Agency</option>
                      <option>Consulting</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Style</label>
                    <select
                      value={candidateData.recruiterPreferences!.evaluationStyle}
                      onChange={(e) => updatePreferences('evaluationStyle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Conservative</option>
                      <option>Balanced</option>
                      <option>Optimistic</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SkillInput
                    field="requiredSkills"
                    label="Required Skills"
                    placeholder="e.g., React, Node.js, GraphQL"
                  />
                  
                  <SkillInput
                    field="preferredSkills"
                    label="Preferred Skills"
                    placeholder="e.g., TypeScript, AWS, Docker"
                  />
                  
                  <SkillInput
                    field="dealBreakers"
                    label="Deal Breakers"
                    placeholder="e.g., No testing, Poor documentation"
                  />
                  
                  <SkillInput
                    field="keyFocus"
                    label="Key Focus Areas"
                    placeholder="e.g., Performance, Security, UX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Criteria</label>
                  <textarea
                    value={candidateData.recruiterPreferences!.customCriteria}
                    onChange={(e) => updatePreferences('customCriteria', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional specific requirements or context..."
                  />
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={runDetailedEvaluation}
                disabled={loading.detailed}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading.detailed ? 'Evaluating...' : 'Run Detailed Evaluation'}
              </button>
            </div>
          </div>
        )}

        {/* Detailed Evaluation Results */}
        {candidateData.detailedEval && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Detailed Evaluation Results</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Match Score</h3>
              <div className="text-3xl font-bold text-blue-600">
                {candidateData.detailedEval.matchScore}/10
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Matching Skills</h3>
              <ul className="list-disc pl-5 text-green-700">
                {Array.isArray(candidateData.detailedEval?.matchingSkills)
                  ? candidateData.detailedEval.matchingSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))
                  : <li>-</li>
                }
              </ul>
            </div>
            
            {candidateData.detailedEval.gaps.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Gaps</h3>
                <ul className="list-disc pl-5 text-yellow-700">
                  {candidateData.detailedEval.gaps.map((gap, index) => (
                    <li key={index}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium mb-2">Final Verdict</h3>
              <p className="text-gray-700 font-medium">{candidateData.detailedEval.finalVerdict}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 