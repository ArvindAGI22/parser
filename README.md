# 🎯 Technical Recruiter Evaluation Tool

A full-stack Next.js application that helps technical recruiters evaluate candidates using their GitHub and portfolio links with **dynamic, customizable evaluation criteria**.

## ✨ Key Features

- **🔄 Dynamic System Prompts**: Recruiter preferences dynamically change the AI evaluation criteria
- **📊 Two-Step Evaluation Process**: Base evaluation followed by detailed, customized analysis
- **⚙️ Comprehensive Preferences**: Role type, experience level, company context, evaluation style
- **🎨 Skills Management**: Add/remove required skills, preferred skills, deal breakers, and focus areas
- **💾 LocalStorage Persistence**: All evaluations and preferences are saved locally
- **🚀 Modern UI**: Clean, responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API routes
- **LLM**: Groq (Llama 3.1 8B)
- **Scraping**: Playwright + Cheerio
- **APIs**: GitHub REST API
- **Storage**: localStorage (no database required)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd CACHEparse
npm install
```

### 2. Install Playwright

```bash
npx playwright install chromium
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com/keys

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to use the app.

## 📋 How It Works

### Step 1: Base Evaluation
1. Enter candidate's GitHub URL and Portfolio URL
2. Click "Run Base Evaluation"
3. App scrapes GitHub data and portfolio content
4. AI provides baseline scoring on:
   - GitHub Activity (1-10)
   - Code Quality (1-10)
   - Technical Depth (1-10)
   - Design/Portfolio (1-10)

### Step 2: Dynamic Detailed Evaluation
1. After base evaluation, customize your requirements:
   - **Role Type**: Frontend, Backend, Full-Stack, etc.
   - **Experience Level**: Junior, Mid-level, Senior, Lead
   - **Company Type**: Startup, Enterprise, Agency
   - **Evaluation Style**: Conservative, Balanced, Optimistic
   - **Required Skills**: Must-have technologies
   - **Preferred Skills**: Nice-to-have technologies
   - **Deal Breakers**: Automatic disqualifiers
   - **Key Focus Areas**: What to prioritize
   - **Custom Criteria**: Additional context

2. Click "Run Detailed Evaluation"
3. AI re-evaluates the candidate based on your specific criteria
4. Get customized results with match score and recommendations

## 🎨 Dynamic Prompt System

The system prompt changes based on recruiter preferences:

### Evaluation Style Examples:
- **Conservative**: "Be strict, focus on proven experience, highlight gaps"
- **Optimistic**: "Give benefit of doubt, focus on potential, emphasize growth"
- **Balanced**: "Provide fair assessment, balance strengths and weaknesses"

### Company Context Examples:
- **Startup**: "Value versatility, self-starters, ability to wear multiple hats"
- **Enterprise**: "Value depth, proven track record at scale, best practices"
- **Agency**: "Value client-facing skills, diverse projects, context-switching"

### Experience Level Expectations:
- **Junior**: "Focus on learning potential, don't expect deep production experience"
- **Senior**: "Expect deep expertise, mentorship experience, system design skills"

## 📁 Project Structure

```
CACHEparse/
├── pages/
│   ├── index.tsx              # Main UI with dynamic preferences
│   ├── _app.tsx               # App wrapper with global styles
│   └── api/
│       ├── base-eval.ts       # Base evaluation endpoint
│       └── detailed-eval.ts   # Dynamic detailed evaluation
├── utils/
│   ├── github.ts              # GitHub API utilities
│   ├── scraper.ts             # Portfolio scraping utilities
│   └── prompts.ts             # Dynamic prompt generation
├── types/
│   └── index.ts               # TypeScript interfaces
├── styles/
│   └── globals.css            # Tailwind imports
├── package.json               # Dependencies
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind configuration
└── postcss.config.js          # PostCSS configuration
```

## 🔧 API Endpoints

### `/api/base-eval`
- **Method**: POST
- **Body**: `{ githubUrl, portfolioUrl }`
- **Response**: Base evaluation with scores and summary

### `/api/detailed-eval`
- **Method**: POST  
- **Body**: `{ baseEval, recruiterPreferences }`
- **Response**: Customized evaluation based on preferences

## 🎯 Recruiter Preferences Schema

```typescript
interface RecruiterPreferences {
  roleType: string;                    // "Frontend Developer"
  experienceLevel: string;             // "Mid-level (3-5 years)"
  companyType: string;                 // "Startup"
  evaluationStyle: string;             // "Balanced"
  requiredSkills: string[];            // ["React", "Node.js"]
  preferredSkills: string[];           // ["TypeScript", "AWS"]
  dealBreakers: string[];              // ["No testing"]
  keyFocus: string[];                  // ["Performance", "Security"]
  customCriteria: string;              // Additional context
}
```

## 🚫 Limitations

- No database - all data stored in localStorage
- Rate limited by GitHub API (60 requests/hour without auth)
- Portfolio scraping might fail on complex SPAs
- Groq API rate limits apply

## 🔮 Future Enhancements

- Add GitHub API authentication for higher rate limits
- Support for more portfolio platforms (Behance, Dribbble)
- PDF export of evaluation results
- Team collaboration features
- Advanced filtering and search

## 🛡️ Security Notes

- No sensitive data stored in database
- Environment variables required for API keys
- Rate limiting handled by external services
- No user authentication required

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

**Built with ❤️ for technical recruiters who want smarter candidate evaluation** #   p r o p a r s e r  
 