'use client';
import { useState } from 'react';
import AppShell from '@/components/AppShell';

const sections = [
  {
    id: 'getting-started', icon: '🚀', title: 'Getting Started',
    content: [
      { h: 'Welcome to QA Academy', body: 'QA Academy is an AI-powered software testing education platform. Whether you are a complete beginner or a seasoned QA professional looking to upskill, every feature is designed to help you grow faster and smarter.' },
      { h: 'Creating Your Profile', body: 'When you first open the app, your progress is automatically tracked in your browser session. Your XP, level, streak, badges, and module progress are all saved locally and shown in the sidebar at all times.' },
      { h: 'Navigating the Platform', body: 'Use the left sidebar to jump between any section. On mobile, tap the ☰ menu icon to open the sidebar. The sidebar shows your current level, XP bar, streak counter, bugs found, and badges earned at a glance.' },
      { h: 'Your First 30 Minutes', body: '1. Check the Dashboard for today\'s Daily Challenge — complete it for instant XP.\n2. Open Learning Path and start the first module "QA Fundamentals".\n3. After the module, visit Quiz Center and test yourself.\n4. Head to Capstone Projects and launch the E-Commerce workspace to try finding real bugs.\n5. Visit Career Intelligence → Career Quiz to discover which QA specialisation fits you.' },
    ],
  },
  {
    id: 'dashboard', icon: '🏠', title: 'Dashboard',
    content: [
      { h: 'Overview', body: 'The Dashboard is your home base. It shows your total XP, current level badge, modules completed, certifications earned, and your learning streak.' },
      { h: 'Daily Challenge', body: 'A fresh challenge appears every day covering one of 7 rotating QA topics. Completing it earns 20–50 XP and keeps your streak alive. Challenges take 5–15 minutes and cover everything from test case design to API debugging.' },
      { h: 'Streak Counter', body: 'Your streak tracks consecutive days of activity. A 3-day streak earns a ⚡ badge, a 7-day streak earns a 🔥 badge. Streaks reset if you miss a full day, so try to complete at least one challenge daily.' },
      { h: 'Achievements', body: 'There are 12 unlockable achievement badges for key milestones: First Test Written, First Certification, 7-Day Streak, All Capstone Projects Completed, QA Lead Level, and more. Hover any badge to see the requirement.' },
    ],
  },
  {
    id: 'learning-path', icon: '📚', title: 'Learning Path',
    content: [
      { h: 'Module Structure', body: 'There are 21 modules across 5 levels: Beginner, Intermediate, Advanced, Expert, and QA Lead. Each module has reading content, worked examples, and links to relevant quiz questions. Completing a module marks it done and adds XP to your total.' },
      { h: 'How to Study Effectively', body: 'Work through modules in order — each one builds on the previous. After reading each section, close it and summarise it in your own words before moving on. Then immediately go to the Quiz Center and test that topic.' },
      { h: 'XP Rewards', body: 'Beginner modules give 50 XP, Intermediate 100 XP, Advanced 150 XP, Expert 175 XP, and QA Lead modules 200 XP each. Complete all 21 modules to reach Level 5 and unlock the QA Lead badge.' },
      { h: 'Module Topics', body: 'Beginner: QA Fundamentals, Test Case Design, Bug Reporting, Agile Testing.\nIntermediate: Web Testing, API Testing, Database Testing, Test Management.\nAdvanced: Playwright, Selenium, CI/CD, Performance Testing.\nExpert: SDET Skills, Security Testing, Mobile Testing, AI Testing.\nQA Lead: Strategy, Leadership, Metrics, Risk-Based Testing.' },
    ],
  },
  {
    id: 'quiz', icon: '🎯', title: 'Quiz Center',
    content: [
      { h: 'Practice Mode vs Exam Mode', body: 'Practice Mode shows the explanation after each answer — perfect for learning. Exam Mode is timed and simulates the real certification exam format. Use Practice Mode while studying modules, switch to Exam Mode when preparing for certification.' },
      { h: 'Scoring', body: 'Score 80% or above to pass and earn full XP. Scores between 60–79% earn partial XP and flag that topic for review. Below 60% earns no XP but you can retry immediately. There is no penalty for retrying.' },
      { h: 'Weak Areas Mode', body: 'After answering at least 20 questions, the Weak Areas filter becomes available. It only serves questions from topics you have scored below 70% on, helping you close knowledge gaps efficiently.' },
      { h: 'Tips for High Scores', body: '• Read each question twice before answering.\n• Eliminate clearly wrong options first.\n• For scenario questions, think "what would happen in production?" not "what sounds right in theory".\n• Review every explanation, even for questions you got correct — the explanation often contains exam tips.' },
    ],
  },
  {
    id: 'capstone', icon: '🏆', title: 'Capstone Projects',
    content: [
      { h: 'What Are Capstone Projects?', body: 'Capstone Projects are the most hands-on feature of QA Academy. Each workspace simulates a real application with deliberately planted bugs. You explore the app, find the bugs, file bug reports, and execute test cases — exactly as you would in a real QA job.' },
      { h: 'How to Launch a Workspace', body: 'Go to Capstone Projects in the sidebar. Click the card for the project you want. Click "🧪 Launch Workspace". The workspace opens with four tabs: Test App (the live simulated app), Bug Tracker, Test Cases, and Report.' },
      { h: 'Finding Bugs', body: 'Interact with the Test App tab as a real user would. Try edge cases: empty fields, invalid inputs, boundary values, wrong sequences of steps. When a bug triggers, a notification appears and the bug is automatically logged in the Bug Tracker. You can also file bugs manually.' },
      { h: 'Writing Bug Reports', body: 'Good bug reports in the Bug Tracker should include: a clear title, the severity (Critical/High/Medium/Low), precise steps to reproduce, the expected result, and the actual result. Attach a screenshot if possible. The system scores your report quality.' },
      { h: 'Test Case Execution', body: 'The Test Cases tab has a list of pre-written test cases for the project. As you test each scenario, tick the checkbox to mark it executed. 40% of your score comes from test case coverage, so work through the full list.' },
      { h: 'Scoring', body: '60% of your score comes from bugs discovered (each hidden bug is worth equal points). 40% comes from test cases checked off. A 100% score means you found all bugs AND executed all test cases. Your score and a full report are available in the Report tab.' },
      { h: 'Project 1 — E-Commerce (ShopNow)', body: 'Difficulty: Beginner. 6 hidden bugs. Focus areas: shopping cart edge cases, checkout validation, promo codes, tax calculation, email validation. Start here if you are new to testing.' },
      { h: 'Project 2 — AI Chatbot Testing', body: 'Difficulty: Intermediate. 6 AI quality failures to find: system prompt exposure, jailbreak vulnerability, hallucination, inconsistent answers, inappropriate advice, and sycophantic behaviour. Use the Test Prompts panel on the left.' },
      { h: 'Project 5 — SaaS CRM (Multi-Tenant)', body: 'Difficulty: Advanced. 6 security and access control bugs. Use the Test Controls panel to switch between Admin/Manager/Viewer roles and between Tenant A and Tenant B. Tests your knowledge of RBAC and data isolation.' },
    ],
  },
  {
    id: 'ai-tutor', icon: '🤖', title: 'Khirad — AI Tutor',
    content: [
      { h: 'What Is Khirad?', body: 'Khirad is QA Academy\'s built-in AI assistant. She has encyclopedic knowledge of the entire platform, every QA concept, all automation tools, CI/CD pipelines, career paths, and interview preparation. She is available 24/7 with no waiting.' },
      { h: 'How to Ask Good Questions', body: 'Be specific for best results. Instead of "tell me about testing", ask "what is the difference between smoke testing and sanity testing?" or "explain how to handle flaky tests in a GitHub Actions pipeline". The more context you give, the better the answer.' },
      { h: 'Suggested Questions', body: 'When you first open Khirad, 16 suggested questions appear as quick-tap buttons. These cover the most popular topics: STLC, Playwright vs Cypress, career salary data, capstone bugs, certifications, and more. Tap any to instantly start a conversation.' },
      { h: 'Follow-Up Chips', body: 'After every answer, Khirad suggests 3–4 follow-up questions as clickable chips. These guide you deeper into the topic without you having to think of what to ask next. Use them to explore related concepts quickly.' },
      { h: 'Starting a New Chat', body: 'Click "+ New chat" in the top-right to reset the conversation. The suggested questions panel reappears. Use this when switching to a completely different topic.' },
    ],
  },
  {
    id: 'interview', icon: '💼', title: 'Interview Prep',
    content: [
      { h: 'Overview', body: 'Interview Prep contains 200+ real QA interview questions with detailed model answers. Questions are tagged by topic (Fundamentals, Automation, API, Performance, Security, Agile, Behavioural) and by seniority level (Junior, Mid-Level, Senior, Lead).' },
      { h: 'How to Use It', body: 'Filter by your target role level. Read the question, formulate your own answer mentally, then reveal the model answer. Compare your answer to the model and note what you missed. Do not just read the answers passively — active recall is essential.' },
      { h: 'Behavioural Questions', body: 'Behavioural questions (STAR method) are just as important as technical ones. Use the STAR framework: Situation, Task, Action, Result. Have 5–6 real stories from your experience ready that can be adapted to different behavioural questions.' },
      { h: 'Practice Tip', body: 'Ask Khirad (AI Tutor) to conduct a mock interview with you. Type "Ask me 10 QA interview questions one by one and give me feedback on my answers." This simulates a real interview much better than just reading Q&As.' },
    ],
  },
  {
    id: 'certs', icon: '🏅', title: 'Certifications',
    content: [
      { h: 'How to Qualify', body: 'Each certification requires completing specific learning modules. The required modules are listed on each certificate card. Once all prerequisites are completed, the "Take Exam" button activates.' },
      { h: 'The Exam', body: 'Certification exams are timed, 40–60 questions, and require 80% to pass. They run in Exam Mode (no explanations shown during the test). You have unlimited attempts but a 24-hour cooldown between attempts.' },
      { h: 'Downloading Your Certificate', body: 'After passing, click "Download Certificate" to save a professionally formatted PDF. Each certificate includes your name, the certification title, the date earned, and a unique verification code.' },
      { h: 'Sharing on LinkedIn', body: 'Click "Share on LinkedIn" to automatically populate a LinkedIn post with your certificate details and a shareable link. This is the fastest way to signal your new credential to employers.' },
      { h: 'Which Certificate First?', body: 'Start with QA Fundamentals (free on all plans). Then go for Web Automation Engineer (Playwright) or API Testing Specialist — these two have the highest ROI in the current job market.' },
    ],
  },
  {
    id: 'career', icon: '🚀', title: 'Career Intelligence',
    content: [
      { h: 'Career Quiz', body: 'The 6-question Career Quiz uses weighted scoring to match you with the QA specialisation that best fits your personality, current skills, and goals. Answer honestly — there are no wrong answers. Your top result shows salary ranges, time to switch, and a day-in-the-life description.' },
      { h: 'Career Paths', body: 'Seven detailed career path profiles are available: SDET, AI Quality Engineer, Security QA, Performance Engineer, QA Lead, Mobile QA, and DevOps QA. Each shows salary ranges by experience level, top hiring companies, required skills, and what the role is NOT suited to.' },
      { h: 'Career Switch Guide', body: 'The switch guide provides month-by-month plans for common transitions: Manual → SDET (6 months), SDET → AI Quality (4 months), Developer → QA (3 months), Graduate → QA (4 months), BA → QA Lead (5 months). Each plan includes salary jump estimates and red flags to watch for.' },
      { h: 'Market Trends', body: 'Updated market trend data shows which skills are growing (AI testing, security QA, Playwright) and which are declining (manual-only regression, older Selenium patterns without modern frameworks). Use this to prioritise what to learn next.' },
      { h: 'Salary Guide & Negotiation', body: 'The full salary table covers 8 roles × 4 experience levels. The negotiation playbook gives 5 evidence-based tips for salary discussions, including how to use competing offers, how to frame your automation ROI, and when to walk away.' },
      { h: 'Risk Assessment', body: 'The Risk Assessment evaluates 8 factors in your current role: automation adoption, AI tool exposure, skill diversity, seniority, market demand for your specialisation, and more. It gives a personalised risk score (HIGH/MEDIUM/LOW) with specific action steps.' },
    ],
  },
  {
    id: 'cicd', icon: '🔄', title: 'CI/CD & GitHub',
    content: [
      { h: 'Overview', body: 'The CI/CD & GitHub section teaches you how to integrate automated tests into software delivery pipelines — one of the most in-demand skills for QA engineers in 2025.' },
      { h: 'Section Navigation', body: 'Use the left sidebar within the page to jump between 8 sections: Core Concepts, GitHub Actions, Playwright in CI, API Tests in CI, Performance in CI, Pipeline Stages, Best Practices, and Real-World Examples.' },
      { h: 'Code Examples', body: 'Every section contains copy-ready YAML and code examples. Click the "Copy" button on any code block to copy it to your clipboard. The examples are production-quality and can be used directly in real projects.' },
      { h: 'Pipeline Stages', body: 'The Pipeline Stages section shows a clickable visual of an 8-stage QA pipeline. Click any stage to expand the full detail: what runs, why it matters, what fails it, and how to fix common errors.' },
    ],
  },
  {
    id: 'automation', icon: '🧪', title: 'Automation Tools',
    content: [
      { h: 'Tools Covered', body: 'Full installation and usage guides for: Playwright, Cypress, Selenium WebDriver, Jest/Vitest, Postman/Newman, k6 Load Testing, and Appium Mobile.' },
      { h: 'How to Use the Guides', body: 'Each tool has a dedicated tab. The guide walks through: installation (with OS-specific commands for Windows, macOS, Linux), project structure, first test, run commands, and CI integration. Copy commands directly from the guide.' },
      { h: '"How It Works" Section', body: 'The final tab explains the internal architecture of each tool — how Playwright uses CDP, how Cypress runs inside the browser, how Selenium uses the WebDriver HTTP protocol. This knowledge helps you debug failures faster.' },
      { h: 'Which Tool to Learn First?', body: 'The guide includes a "Which Tool Should I Learn First?" decision matrix covering 7 scenarios. If you are starting from scratch, the recommendation is Playwright + TypeScript — highest job demand, best developer experience, and easiest CI integration.' },
    ],
  },
  {
    id: 'ai-tools', icon: '🛠️', title: 'AI Tools & IDEs',
    content: [
      { h: 'Tools Covered', body: 'Installation and usage guides for: Claude Code (Anthropic CLI), GitHub Copilot, Cursor IDE, Codeium/Windsurf, Tabnine, and CLI tools (Aider, Ollama, llm).' },
      { h: 'QA Workflows Section', body: 'The QA Workflows tab shows 6 real workflows where AI tools save time: generating Playwright tests from a user story, debugging CI failures, generating API test coverage, creating test data, AI code review for tests, and converting manual test cases to automation.' },
      { h: 'Prompt Library', body: 'The Prompt Library tab contains 6 copy-ready prompts optimised for QA engineers. Each prompt is designed to get the best output from any AI coding assistant. Click "Copy Prompt" and paste directly into Claude Code, Copilot Chat, or Cursor.' },
    ],
  },
  {
    id: 'cv-writer', icon: '📄', title: 'CV / Resume Writer',
    content: [
      { h: 'Overview', body: 'The CV Writer generates a complete, professionally formatted resume tailored to a specific job description. It detects your role type from keywords and creates role-specific achievement bullet points, a tailored summary, and a structured skills section.' },
      { h: 'Step 1 — Personal Info', body: 'Enter your full name, email, phone number (with country code), location, LinkedIn URL, GitHub username, and optional portfolio website. These appear in the resume header.' },
      { h: 'Step 2 — Target Role', body: 'Enter the job title you are applying for, your years of experience, and optionally a short paragraph about yourself. Then paste the full job description (or just the key skills) into the Keywords field. The more keywords you provide, the more tailored your resume will be.' },
      { h: 'Step 3 — Work History', body: 'Add up to 3 (or more) previous positions. Enter the job title, company name, start/end dates, and location. The AI generates 3 strong achievement bullet points per role based on your keywords — you do not need to write them yourself.' },
      { h: 'Step 4 — Education & Extras', body: 'Add your degrees, certifications (one per line), and languages spoken. Certifications from QA Academy can be listed here.' },
      { h: 'Step 5 — Preview & Download', body: 'The Preview tab shows a live rendered version of your resume. Click "Download PDF" for a formatted PDF with a dark header and purple accents. Click "Download DOCX" for a Word document you can manually edit. Both files are named with your name automatically.' },
      { h: 'Editing the Output', body: 'The DOCX download opens in Microsoft Word and is fully editable. Replace any generated bullet point with your own achievements. The formatting is preserved. For the PDF, edit the DOCX first and re-export if needed.' },
    ],
  },
  {
    id: 'plans', icon: '💎', title: 'Plans & Pricing',
    content: [
      { h: 'Basic (Free)', body: 'All 21 learning modules, full Quiz Center access, 1 free certification (QA Fundamentals), 3 capstone project workspaces, AI Tutor Khirad (10 messages/day), and community support. No credit card required.' },
      { h: 'Pro ($29/month)', body: 'Everything in Basic plus: all 8 certifications, unlimited AI Tutor messages, all capstone projects (including the advanced SaaS workspace), full Interview Prep library, LinkedIn certificate sharing, and priority email support.' },
      { h: 'Enterprise ($99/user/month)', body: 'Everything in Pro plus: team admin dashboard, custom learning paths, manager progress tracking, dedicated success manager, custom branding, and SSO/compliance reporting. Minimum 5 users.' },
      { h: 'Which Plan Is Right For Me?', body: 'If you are self-studying and want to test the platform: start Free. If you are actively job hunting or upskilling: go Pro — the unlimited AI Tutor and all certifications pay for themselves after one salary increase. If you are onboarding a QA team: Enterprise.' },
    ],
  },
  {
    id: 'tips', icon: '💡', title: 'Pro Tips & Best Practices',
    content: [
      { h: 'The 30-Day Fast Track', body: 'Week 1: Complete all Beginner modules + quizzes. Week 2: Complete Intermediate modules + start Capstone Project 1. Week 3: Advanced modules + Capstone Project 2. Week 4: Expert modules + Career Quiz + CV Writer + apply for 3 jobs.' },
      { h: 'Maximise XP Daily', body: '1. Complete the daily challenge (20–50 XP).\n2. Complete one learning module (50–200 XP).\n3. Pass a quiz at 80%+ (30–100 XP).\nDoing all three daily gives 100–350 XP per day. You can reach Expert level in under 2 weeks.' },
      { h: 'Build Your Portfolio', body: 'Screenshot your capstone bug reports and test execution results. Export your certificates. Push the Playwright code you write while following the Automation Tools guides to GitHub. Link everything in your CV Writer output.' },
      { h: 'Use Khirad for Interview Prep', body: 'The night before an interview, open Khirad and ask: "Give me the top 10 QA interview questions for a [role] at a [company type] and rate my answers." This live mock interview practice is more effective than reading Q&As passively.' },
      { h: 'Career Switch Timing', body: 'The Career Intelligence Risk Assessment is designed to be run quarterly. If your risk score is HIGH, treat it as urgent — start the recommended learning path immediately. The job market for manual-only QAs is contracting faster than most realise.' },
    ],
  },
];

export default function ManualPage() {
  const [active, setActive] = useState('getting-started');
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? sections.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.content.some(c => c.h.toLowerCase().includes(search.toLowerCase()) || c.body.toLowerCase().includes(search.toLowerCase()))
      )
    : sections;

  const activeSection = sections.find(s => s.id === active) ?? sections[0];

  return (
    <AppShell>
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '20px 28px', borderBottom: '1px solid rgba(99,102,241,0.12)',
        background: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            boxShadow: '0 0 20px rgba(99,102,241,0.35)',
          }}>📘</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>User Manual</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Complete guide to every feature of QA Academy</p>
          </div>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search the manual…"
          style={{
            width: '100%', maxWidth: 480, padding: '9px 16px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10, color: '#e2e8f0', fontSize: 13.5, outline: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar TOC */}
        <div style={{
          width: 230, flexShrink: 0, borderRight: '1px solid rgba(99,102,241,0.1)',
          background: 'rgba(10,10,18,0.8)', overflowY: 'auto', padding: '14px 10px',
        }}>
          <div style={{ fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 8px 10px' }}>Contents</div>
          {filtered.map(s => (
            <button key={s.id} onClick={() => { setActive(s.id); setSearch(''); }}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 10,
                background: active === s.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: active === s.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                color: active === s.id ? '#a5b4fc' : '#64748b',
                fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9,
                fontWeight: active === s.id ? 700 : 400, transition: 'all 0.15s', marginBottom: 2,
              }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
              {s.title}
            </button>
          ))}
          {filtered.length === 0 && <div style={{ fontSize: 12, color: '#475569', padding: '12px 8px' }}>No results for "{search}"</div>}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '36px 44px 60px' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            }}>{activeSection.icon}</div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>{activeSection.title}</h2>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{activeSection.content.length} topics covered</div>
            </div>
          </div>

          {/* Topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {activeSection.content.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(20,20,35,0.6)', border: '1px solid rgba(99,102,241,0.1)',
                borderRadius: 16, padding: '22px 26px', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: 'linear-gradient(180deg, #6366f1, #a855f7)',
                  borderRadius: '3px 0 0 3px',
                }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#c7d2fe', margin: '0 0 10px 0' }}>{item.h}</h3>
                <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75 }}>
                  {item.body.split('\n').map((line, j) => (
                    <p key={j} style={{ margin: j === 0 ? 0 : '6px 0 0' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation between sections */}
          <div style={{ display: 'flex', gap: 12, marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(99,102,241,0.1)' }}>
            {sections[sections.findIndex(s => s.id === active) - 1] && (
              <button onClick={() => setActive(sections[sections.findIndex(s => s.id === active) - 1].id)}
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: 12, textAlign: 'left',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', fontSize: 13, cursor: 'pointer',
                }}>
                ← {sections[sections.findIndex(s => s.id === active) - 1].title}
              </button>
            )}
            {sections[sections.findIndex(s => s.id === active) + 1] && (
              <button onClick={() => setActive(sections[sections.findIndex(s => s.id === active) + 1].id)}
                style={{
                  flex: 1, padding: '12px 18px', borderRadius: 12, textAlign: 'right',
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                  color: '#a5b4fc', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                }}>
                {sections[sections.findIndex(s => s.id === active) + 1].title} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
