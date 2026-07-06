'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

/* ─── Types ─────────────────────────────────────────────── */
type View = 'home' | 'quiz' | 'result' | 'paths' | 'switch' | 'market' | 'salary' | 'risk';

/* ─── Career Paths Data ─────────────────────────────────── */

const careerPaths = [
  {
    id: 'sdet',
    title: 'SDET',
    subtitle: 'Software Dev Engineer in Test',
    icon: '⚙️',
    color: '#6366f1',
    salaryRange: '$85k – $160k',
    demandTrend: '📈 High',
    timeToSwitch: '3–6 months',
    tags: ['Automation', 'Code', 'CI/CD', 'APIs'],
    description: 'Write the automation frameworks that other QAs run tests on. Equal parts developer and tester. The highest-paying QA role at most companies.',
    skills: ['Playwright / Selenium', 'Python / Java / TypeScript', 'REST API testing', 'CI/CD pipelines', 'Docker basics', 'Git & code review'],
    dayInLife: [
      'Morning: review overnight CI failures, fix flaky tests',
      'Build new automation framework for the payments module',
      'Code review pull requests from QA engineers',
      'Pair with developers to improve testability of new features',
      'Write API tests for the new onboarding endpoints',
    ],
    bestFor: ['People who love to code', 'Manual QAs who want a 40-60% salary bump', 'Developers who prefer testing to features'],
    notFor: ['People who dislike writing code daily', 'Those who prefer exploratory/manual testing'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'Stripe'],
  },
  {
    id: 'qa-lead',
    title: 'QA Lead',
    subtitle: 'QA Team Lead / Manager',
    icon: '👑',
    color: '#f59e0b',
    salaryRange: '$90k – $150k',
    demandTrend: '📈 Stable-High',
    timeToSwitch: '1–2 years',
    tags: ['Leadership', 'Strategy', 'People', 'Planning'],
    description: 'Lead a team of QA engineers. Define testing strategy, own quality standards, mentor junior testers, and report to engineering leadership.',
    skills: ['Team leadership & mentoring', 'Test strategy & planning', 'Risk-based testing', 'Stakeholder communication', 'Agile/Scrum ceremonies', 'Metrics & reporting'],
    dayInLife: [
      'Morning standups with QA team across 2 time zones',
      'Review and approve test plans for the next sprint',
      '1:1 coaching session with a junior QA engineer',
      'Present quality metrics to the VP of Engineering',
      'Interview candidates for open QA positions',
    ],
    bestFor: ['Experienced QAs (5+ years) who want to lead', 'Natural communicators and mentors', 'People who want influence over the product roadmap'],
    notFor: ['Those who dislike people management', 'QAs who prefer hands-on testing over strategy'],
    companies: ['Any company with 5+ engineers', 'Startups scaling their QA team'],
  },
  {
    id: 'ai-quality',
    title: 'AI Quality Engineer',
    subtitle: 'ML / AI Testing Specialist',
    icon: '🤖',
    color: '#a855f7',
    salaryRange: '$110k – $200k',
    demandTrend: '🚀 Explosive Growth',
    timeToSwitch: '6–12 months',
    tags: ['AI/ML', 'LLMs', 'Data', 'Emerging'],
    description: 'Test AI and ML systems: validate model outputs, evaluate LLM quality, catch hallucinations and bias, build AI-specific test frameworks. The fastest growing QA specialty in 2024–2026.',
    skills: ['Python (data science stack)', 'LLM evaluation techniques', 'Statistical testing concepts', 'Prompt engineering', 'ML pipeline testing', 'Responsible AI & bias detection'],
    dayInLife: [
      'Evaluate 500 LLM responses against quality rubrics',
      'Build automated hallucination detection tests',
      'Red-team the new AI feature for safety issues',
      'Work with data scientists to define model quality metrics',
      'Write test cases for edge cases in the recommendation engine',
    ],
    bestFor: ['QAs curious about AI/ML', 'People who want to be at the frontier', 'Python-comfortable testers'],
    notFor: ['Those who want well-defined test criteria (AI outputs are probabilistic)', 'People not interested in statistics or data'],
    companies: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Scale AI', 'Hugging Face', 'every company building AI products'],
  },
  {
    id: 'security-qa',
    title: 'Security QA',
    subtitle: 'AppSec / Penetration Tester',
    icon: '🛡️',
    color: '#ef4444',
    salaryRange: '$100k – $180k',
    demandTrend: '📈 Always High',
    timeToSwitch: '6–18 months',
    tags: ['Security', 'Pentesting', 'OWASP', 'Bug Bounty'],
    description: 'Test applications for security vulnerabilities: SQL injection, XSS, auth flaws, API security, and more. Companies are desperate for people who understand both testing and security.',
    skills: ['OWASP Top 10', 'Burp Suite / OWASP ZAP', 'API security testing', 'Auth & session management', 'SAST/DAST tools', 'Basic scripting for exploitation'],
    dayInLife: [
      'Run OWASP ZAP scan against the staging API',
      'Manually test authentication flows for session fixation bugs',
      'Review new code changes for security anti-patterns',
      'Write security test cases for the new payment feature',
      'Present penetration test findings to engineering leadership',
    ],
    bestFor: ['QAs who find exploiting systems exciting', 'People interested in the hacker mindset', 'Those who want premium salaries with high demand'],
    notFor: ['People uncomfortable with ambiguity (security testing is very exploratory)', 'Those who prefer structured test cases'],
    companies: ['Banks & FinTech', 'Healthcare', 'Government', 'Security firms (Crowdstrike, Rapid7)', 'Every regulated industry'],
  },
  {
    id: 'performance',
    title: 'Performance Engineer',
    subtitle: 'Load / Performance Tester',
    icon: '📊',
    color: '#10b981',
    salaryRange: '$90k – $165k',
    demandTrend: '📈 High',
    timeToSwitch: '4–8 months',
    tags: ['Load Testing', 'k6', 'Monitoring', 'Scalability'],
    description: "Make sure the app doesn't fall over under load. Identify bottlenecks, validate scalability, and work closely with backend engineers on performance. High impact, high visibility role.",
    skills: ['k6 / JMeter / Gatling', 'Monitoring (Grafana, DataDog, New Relic)', 'Database query analysis', 'Linux performance tools', 'Cloud infrastructure basics', 'Statistical analysis of results'],
    dayInLife: [
      'Run load test against checkout with 500 simulated users',
      'Analyze slow database queries identified in Grafana',
      'Work with backend team to fix an N+1 query problem',
      'Build performance test suite for the new microservice',
      'Present performance regression report at sprint review',
    ],
    bestFor: ['Analytical thinkers who love data', 'QAs interested in backend systems', 'People who want to prevent major outages (high impact)'],
    notFor: ['Those who prefer frontend-focused work', 'People who dislike statistics and data analysis'],
    companies: ['E-commerce', 'SaaS companies', 'Gaming', 'Any company that has had a traffic spike kill their site'],
  },
  {
    id: 'mobile-qa',
    title: 'Mobile QA',
    subtitle: 'iOS & Android Test Engineer',
    icon: '📱',
    color: '#06b6d4',
    salaryRange: '$80k – $145k',
    demandTrend: '📊 Stable',
    timeToSwitch: '3–6 months',
    tags: ['iOS', 'Android', 'Appium', 'XCUITest'],
    description: 'Specialize in testing native mobile apps on iOS and Android. Includes device fragmentation testing, OS version compatibility, app store compliance, and mobile-specific UX.',
    skills: ['Appium / XCUITest / Espresso', 'iOS & Android device ecosystem', 'Mobile network conditions testing', 'Accessibility testing (WCAG mobile)', 'App store submission process', 'Device farm tools (BrowserStack, Sauce Labs)'],
    dayInLife: [
      'Test new feature on 12 device/OS combinations in BrowserStack',
      'Write XCUITest automation for the onboarding flow',
      'Investigate crash reports from the App Store',
      'Accessibility audit of the updated checkout UI',
      'Regression testing before App Store submission',
    ],
    bestFor: ['QAs who use and love mobile apps', 'People interested in the iOS/Android ecosystem', 'Those who enjoy device fragmentation challenges'],
    notFor: ['Web-only testers who don\'t want to learn mobile stacks', 'Those who dislike device setup complexity'],
    companies: ['Mobile-first startups', 'Banks with mobile apps', 'Retail apps', 'Healthcare apps'],
  },
  {
    id: 'devops-qa',
    title: 'DevOps QA / QAOps',
    subtitle: 'Quality in DevOps Pipelines',
    icon: '🔄',
    color: '#f97316',
    salaryRange: '$95k – $170k',
    demandTrend: '🚀 Growing Fast',
    timeToSwitch: '6–12 months',
    tags: ['DevOps', 'Docker', 'Kubernetes', 'Cloud'],
    description: 'Embed quality into CI/CD pipelines. Own the test automation infrastructure, build testing strategies that scale with the team, and ensure releases can go out multiple times per day safely.',
    skills: ['Docker & Kubernetes', 'GitHub Actions / Jenkins / GitLab CI', 'Cloud (AWS/GCP/Azure basics)', 'Infrastructure as Code (Terraform basics)', 'Monitoring & observability', 'Shift-left testing strategies'],
    dayInLife: [
      'Optimize CI pipeline to reduce test runtime from 45 to 12 minutes',
      'Set up test environment provisioning with Docker Compose',
      'Work with platform team on Kubernetes test namespace',
      'Define quality gates that block deployments with > 5% error rate',
      'Implement parallel test execution across 4 GitHub Actions runners',
    ],
    bestFor: ['SDETs who want to move into infrastructure', 'DevOps engineers who care about quality', 'People who love automation at the system level'],
    notFor: ['Those who prefer writing test cases over infrastructure', 'People who dislike cloud/DevOps complexity'],
    companies: ['Any company with a mature DevOps practice', 'Cloud-native companies', 'Companies doing multiple deploys per day'],
  },
];

/* ─── Quiz Questions ─────────────────────────────────────── */

const quizQuestions = [
  {
    q: 'Which of these sounds most exciting to you on a typical workday?',
    options: [
      { text: 'Writing code that catches bugs automatically', scores: { sdet: 3, 'devops-qa': 2, 'ai-quality': 1 } },
      { text: 'Finding hidden security vulnerabilities by thinking like a hacker', scores: { 'security-qa': 3 } },
      { text: 'Leading a team and defining the quality strategy', scores: { 'qa-lead': 3, sdet: 0 } },
      { text: 'Understanding why the app slows down under load', scores: { performance: 3, 'devops-qa': 1 } },
    ],
  },
  {
    q: 'How comfortable are you with writing code?',
    options: [
      { text: 'I love coding — it\'s my favourite part of the job', scores: { sdet: 3, 'devops-qa': 2, 'ai-quality': 2 } },
      { text: 'I can code but prefer not to do it all day', scores: { 'security-qa': 2, performance: 2, 'mobile-qa': 1 } },
      { text: 'I\'m learning to code but not confident yet', scores: { 'qa-lead': 2, 'mobile-qa': 2, 'security-qa': 1 } },
      { text: 'I prefer strategy, tools, and communication over coding', scores: { 'qa-lead': 3 } },
    ],
  },
  {
    q: 'What\'s your biggest professional motivator?',
    options: [
      { text: 'Maximum salary ceiling — I want to earn as much as possible', scores: { 'ai-quality': 3, sdet: 2, 'security-qa': 2 } },
      { text: 'Job security — I want skills that will always be in demand', scores: { 'security-qa': 3, sdet: 2, performance: 1 } },
      { text: 'Being at the cutting edge of technology', scores: { 'ai-quality': 3, 'devops-qa': 2 } },
      { text: 'Influence and leadership — I want to shape how the team works', scores: { 'qa-lead': 3 } },
    ],
  },
  {
    q: 'Which technology area genuinely interests you most?',
    options: [
      { text: 'AI, machine learning, and large language models', scores: { 'ai-quality': 3 } },
      { text: 'Cloud infrastructure, Docker, CI/CD pipelines', scores: { 'devops-qa': 3, sdet: 1 } },
      { text: 'Mobile apps — iOS and Android', scores: { 'mobile-qa': 3 } },
      { text: 'Security, hacking, vulnerabilities', scores: { 'security-qa': 3 } },
    ],
  },
  {
    q: 'How much do you enjoy data analysis and statistics?',
    options: [
      { text: 'I love analysing data, charts, and metrics', scores: { performance: 3, 'ai-quality': 2 } },
      { text: 'I\'m comfortable with it but it\'s not my favourite', scores: { sdet: 2, 'devops-qa': 1 } },
      { text: 'I prefer qualitative analysis over numbers', scores: { 'security-qa': 2, 'qa-lead': 1 } },
      { text: 'Numbers stress me out — I prefer exploratory work', scores: { 'mobile-qa': 2, 'security-qa': 1 } },
    ],
  },
  {
    q: 'Where are you in your career right now?',
    options: [
      { text: '0–2 years experience — I\'m just starting', scores: { sdet: 2, 'mobile-qa': 2 } },
      { text: '2–5 years — I\'m solid but want to specialise', scores: { sdet: 2, 'security-qa': 2, performance: 2, 'ai-quality': 2 } },
      { text: '5–8 years — I\'m experienced, considering leadership', scores: { 'qa-lead': 3, 'devops-qa': 2 } },
      { text: '8+ years — I want a complete pivot or specialisation', scores: { 'ai-quality': 3, 'security-qa': 2 } },
    ],
  },
];

/* ─── Career Switch Guides ───────────────────────────────── */

const switchPaths = [
  {
    from: '👨‍💼 Manual QA → SDET',
    color: '#6366f1',
    timeline: '3–6 months',
    salaryJump: '+40–70%',
    risk: 'Low',
    steps: [
      { week: 'Weeks 1–4', title: 'Learn Python or JavaScript fundamentals', detail: 'Pick ONE language. Python is easier to start; JS/TS is better if your team uses Node.js. Complete a free course (freeCodeCamp, CS50).' },
      { week: 'Weeks 5–8', title: 'Learn Playwright or Selenium', detail: 'Install and write your first 10 automated tests. Automate the manual tests you run every sprint — instant practical value.' },
      { week: 'Weeks 9–12', title: 'Learn Git properly', detail: 'Branching, pull requests, resolving conflicts. Contribute automation scripts to your company\'s repo — this proves you can work in a codebase.' },
      { week: 'Weeks 13–16', title: 'Learn REST API testing + CI/CD basics', detail: 'Add your Playwright tests to a GitHub Actions workflow. Now you have a full automation pipeline in your portfolio.' },
      { week: 'Month 5–6', title: 'Apply for SDET roles with your portfolio', detail: 'Your portfolio: a GitHub repo with 50+ Playwright tests running in CI, an API test suite, and a README showing the project context.' },
    ],
    redFlags: ['Still running all your automation manually (not in CI)', 'No public GitHub with real test code', 'Claiming "SDET" without being able to code-review automation'],
  },
  {
    from: '⚙️ SDET → AI Quality Engineer',
    color: '#a855f7',
    timeline: '6–12 months',
    salaryJump: '+30–60%',
    risk: 'Medium',
    steps: [
      { week: 'Month 1–2', title: 'Learn Python data science stack', detail: 'NumPy, Pandas, Jupyter notebooks. Focus on data manipulation and statistical thinking, not deep ML theory.' },
      { week: 'Month 3', title: 'Understand LLM evaluation techniques', detail: 'Learn BLEU/ROUGE scores, human evaluation rubrics, automated LLM-as-judge patterns. Read the HELM and LMSYS leaderboard methodology.' },
      { week: 'Month 4–5', title: 'Build an AI testing project', detail: 'Pick any open-source LLM API. Write a test suite that checks for hallucinations, prompt injection, PII leakage, and output consistency.' },
      { week: 'Month 6–8', title: 'Learn responsible AI concepts', detail: 'Bias detection, fairness metrics, safety evaluation. The EU AI Act is driving huge demand for engineers who understand AI risk.' },
      { week: 'Month 9–12', title: 'Contribute to open-source AI evaluation projects', detail: 'Projects like EleutherAI\'s lm-evaluation-harness, Langchain evals, or RAGAS. Open-source contributions are the fastest way to be noticed.' },
    ],
    redFlags: ['Only reading about AI without building anything', 'Skipping the statistics foundation', 'Applying without any AI-specific portfolio work'],
  },
  {
    from: '💼 Developer → QA / SDET',
    color: '#10b981',
    timeline: '1–3 months',
    salaryJump: '-10–+20% (similar range, more balance)',
    risk: 'Very Low',
    steps: [
      { week: 'Week 1–2', title: 'Learn QA mindset (your biggest gap)', detail: 'You can code — now learn to think adversarially. Read "How Google Tests Software" and "Lessons Learned in Software Testing." Understand risk-based testing.' },
      { week: 'Week 3–4', title: 'Learn Playwright and write E2E tests', detail: 'Your coding skills mean this will be fast. Focus on the testing patterns: Page Object Model, fixture management, parallel execution.' },
      { week: 'Week 5–8', title: 'Intern or shadow a QA team', detail: 'The fastest path is an internal transfer at your current company. Talk to your manager about QA rotations or starting a testing guild.' },
      { week: 'Month 3', title: 'Apply as SDET directly', detail: 'Developers who move to QA are highly valued. Emphasise your code quality, CI/CD knowledge, and the value you add to the testing strategy — not just test execution.' },
    ],
    redFlags: ['Treating QA as a "step down" (it\'s not — SDETs often earn more)', 'Only wanting to do automation and skipping QA strategy', 'Not learning exploratory testing fundamentals'],
  },
  {
    from: '🎓 New Graduate → QA',
    color: '#f59e0b',
    timeline: '2–4 months before first job',
    salaryJump: 'Starting: $55k–$75k',
    risk: 'None',
    steps: [
      { week: 'Month 1', title: 'Learn the fundamentals: STLC, test types, Agile', detail: 'Read "Foundations of Software Testing" (ISTQB syllabus). You don\'t need the cert to learn the material — it\'s excellent foundational knowledge.' },
      { week: 'Month 2', title: 'Get ISTQB Foundation certification', detail: 'This $300 cert is the single highest-ROI investment for entry-level QA. Many companies use it as a screening filter. Pass rate is 65% — study for 4 weeks.' },
      { week: 'Month 3', title: 'Learn Playwright and build a portfolio', detail: 'Automate a real public website (e.g. the SWAG Labs demo app at saucedemo.com). Write 30+ tests. Push to GitHub. This is what gets you interviews.' },
      { week: 'Month 4', title: 'Apply to junior QA and QA Analyst roles', detail: 'Target companies with "Test Automation" or "Quality Engineering" teams, not just "QA" — they invest in their testers and provide growth paths.' },
    ],
    redFlags: ['Applying for SDET roles straight out of university without coding portfolio', 'Skipping the manual testing fundamentals (will catch up with you in interviews)', 'Resume that says "Tested applications" with zero specifics'],
  },
  {
    from: '📊 Business Analyst → QA Lead',
    color: '#ec4899',
    timeline: '6–12 months',
    salaryJump: '+10–30%',
    risk: 'Low',
    steps: [
      { week: 'Month 1–2', title: 'Learn software testing fundamentals', detail: 'Your BA skills (requirements analysis, stakeholder communication) are massive QA advantages. Add: test case design techniques, defect lifecycle, and test reporting.' },
      { week: 'Month 3–4', title: 'Join a QA team as a test analyst', detail: 'Internal transfer is ideal. BAs who move to QA often jump straight to senior levels — your domain knowledge is extremely valuable.' },
      { week: 'Month 5–6', title: 'Learn test management tools', detail: 'Jira + Xray, TestRail, Zephyr. Start owning the test plan documentation and sprint test coverage reports.' },
      { week: 'Month 7–12', title: 'Position for QA Lead', detail: 'Lead the testing effort on one major feature. Mentor one junior QA. This builds the evidence for a QA Lead title.' },
    ],
    redFlags: ['Skipping the hands-on testing phase (you must know how to test before you lead)', 'Relying only on your BA communication skills without building QA credibility', 'Not getting hands dirty with at least some tool usage (Postman, basic Playwright)'],
  },
];

/* ─── Market Trends ──────────────────────────────────────── */

const marketTrends = [
  { trend: 'AI Testing demand is 10× in 2 years', direction: '🚀', urgency: 'Act now', detail: 'Every company building AI products needs engineers who can evaluate, test, and red-team AI outputs. This was barely a job title in 2022. By 2026 it\'s one of the highest-paid QA specialties.', action: 'Start learning Python + LLM evaluation techniques today. Even 3 months of focused learning can get you into entry-level AI Quality roles.' },
  { trend: 'Manual QA is being automated away at the bottom', direction: '⚠️', urgency: 'Skill up in 12 months', detail: 'Basic manual test execution (clicking through regression checklists) is the most at-risk QA work. AI tools like Playwright AI, Testim, and Devin are increasingly doing this automatically.', action: 'If you only do manual testing today, start automation training immediately. Aim for at least one strong automation skill before your next performance review.' },
  { trend: 'QA roles merging with DevOps and platform teams', direction: '📈', urgency: 'Medium-term', detail: 'The "QA silo" model is dying. Modern engineering teams want QA engineers who can set up CI/CD, own test environments, and work autonomously with infrastructure. "QAOps" is the emerging pattern.', action: 'Learn Docker, GitHub Actions, and basic cloud concepts. Even surface-level DevOps knowledge makes you dramatically more valuable in a modern team.' },
  { trend: 'Security testing skills command premium salaries', direction: '💰', urgency: 'High ROI', detail: 'Application security breaches are at an all-time high. Companies are desperate for engineers who can find vulnerabilities before attackers do — and are willing to pay $40-60k more than standard QA.', action: 'Start with OWASP Top 10 study. Then Burp Suite Community Edition (free). Attempt HackTheBox or TryHackMe. Security QA has one of the best ROI learning paths.' },
  { trend: 'Remote QA roles are abundant but competitive', direction: '🌍', urgency: 'Opportunity now', detail: 'QA automation roles are among the most remote-friendly in engineering. Companies in the US and UK hire from Eastern Europe, India, and Southeast Asia at competitive salaries. Automation skills unlock global opportunities.', action: 'Polish your English communication skills alongside technical skills. GitHub contributions and an English-language portfolio are your tickets to global remote roles.' },
  { trend: 'AI coding tools are changing what QA engineers do', direction: '🤖', urgency: 'Adapt now', detail: 'Claude Code, GitHub Copilot, and Cursor are letting QA engineers write automation 5× faster. QAs who use these tools outperform those who don\'t. The expectation of output is rising across the industry.', action: 'Adopt at least one AI coding assistant in your daily workflow. The QA engineers who resist AI tools will lose to those who embrace them — this is already happening.' },
];

/* ─── Risk Assessment ────────────────────────────────────── */

const riskFactors = [
  { factor: 'You only do manual testing with no automation skills', risk: 'HIGH', action: 'Start Playwright/Selenium learning today. 3 months changes your risk profile significantly.', color: '#ef4444' },
  { factor: 'Your company is moving to AI-powered features', risk: 'MEDIUM', action: 'Position yourself as the person who will QA those AI features. Volunteer before anyone else does.', color: '#f59e0b' },
  { factor: 'Your team is reducing headcount / automating processes', risk: 'HIGH', action: 'Urgently build automation skills. Also build visibility — ensure leadership knows what value you provide.', color: '#ef4444' },
  { factor: 'You have 10+ years in the same narrow specialisation', risk: 'MEDIUM', action: 'Branch into an adjacent emerging field (AI quality, security, or DevOps QA). Your experience is leverage — apply it somewhere new.', color: '#f59e0b' },
  { factor: 'You write code regularly and contribute to CI/CD', risk: 'LOW', action: 'You\'re well-positioned. Focus on deepening one specialisation (AI, security, or performance) to move to senior levels.', color: '#10b981' },
  { factor: 'You\'re in a leadership/strategy role', risk: 'LOW', action: 'Keep learning what your team uses — you need technical credibility. AI testing strategy knowledge gives you an edge.', color: '#10b981' },
  { factor: 'You work in a highly regulated industry (healthcare, finance)', risk: 'LOW', action: 'Regulated industries are slower to cut QA. Add compliance and security testing skills — these are even more protected.', color: '#10b981' },
  { factor: 'You have no public portfolio or GitHub activity', risk: 'MEDIUM', action: 'Start a personal project. Even a simple automated test suite for a public site, pushed to GitHub, signals competence to employers.', color: '#f59e0b' },
];

/* ─── Component ─────────────────────────────────────────── */

export default function CareerPage() {
  const [view, setView] = useState<View>('home');
  const [quizStep, setQuizStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedPath, setSelectedPath] = useState<typeof careerPaths[0] | null>(null);
  const [selectedSwitch, setSelectedSwitch] = useState<number | null>(null);
  const [expandedTrend, setExpandedTrend] = useState<number | null>(null);
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const handleQuizAnswer = (optionScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([k, v]) => {
      newScores[k] = (newScores[k] || 0) + v;
    });
    setScores(newScores);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setView('result');
    }
  };

  const topResult = view === 'result'
    ? careerPaths.slice().sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))[0]
    : null;
  const top3 = view === 'result'
    ? careerPaths.slice().sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)).slice(0, 3)
    : [];

  return (
    <AppShell>
      <div style={{ minHeight: '100%', background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 60%)' }}>

        {/* Hero nav bar */}
        <div style={{ padding: '20px 32px 0', display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 12 }}>
          {([
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'quiz', icon: '🎯', label: 'Career Quiz' },
            { id: 'paths', icon: '🗺️', label: 'Career Paths' },
            { id: 'switch', icon: '🔀', label: 'Career Switch Guide' },
            { id: 'market', icon: '📈', label: 'Market Trends' },
            { id: 'salary', icon: '💰', label: 'Salary Guide' },
            { id: 'risk', icon: '⚠️', label: 'Risk Assessment' },
          ] as { id: View; icon: string; label: string }[]).map(v => (
            <button key={v.id} onClick={() => { setView(v.id); setQuizStep(0); setScores({}); }} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600,
              background: view === v.id ? 'rgba(99,102,241,0.2)' : 'transparent',
              border: `1px solid ${view === v.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.06)'}`,
              color: view === v.id ? '#a5b4fc' : '#64748b', transition: 'all 0.15s',
            }}>{v.icon} {v.label}</button>
          ))}
        </div>

        <div style={{ padding: '32px 36px', maxWidth: 1000, margin: '0 auto' }}>

          {/* ═══ HOME ═══ */}
          {view === 'home' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px', background: 'linear-gradient(135deg, #a5b4fc, #ec4899, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Career Intelligence
                </h1>
                <p style={{ fontSize: 16, color: '#64748b', maxWidth: 560, margin: '0 auto 24px', lineHeight: 1.7 }}>
                  Your personalised guide to navigating the QA career landscape — whether you're starting out, switching specialisations, or protecting your earnings in a changing market.
                </p>
                <button onClick={() => setView('quiz')} style={{ padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', color: '#fff', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
                  🎯 Find Your Ideal Career Path →
                </button>
              </div>

              {/* 4 feature cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
                {[
                  { icon: '🎯', title: 'Career Quiz', desc: 'Answer 6 questions and discover which QA career path matches your personality and skills.', btn: 'Take Quiz', view: 'quiz' as View, color: '#6366f1' },
                  { icon: '🗺️', title: 'Career Paths', desc: 'Explore all 7 QA specialisations with salaries, day-in-the-life, and the skills you need.', btn: 'Explore Paths', view: 'paths' as View, color: '#a855f7' },
                  { icon: '🔀', title: 'Switch Guide', desc: 'Step-by-step timelines for career transitions — what to learn, in what order, and by when.', btn: 'Plan My Switch', view: 'switch' as View, color: '#ec4899' },
                  { icon: '⚠️', title: 'Risk Assessment', desc: 'Is your current role at risk? Find out which QA skills are safe and which are being automated away.', btn: 'Check My Risk', view: 'risk' as View, color: '#ef4444' },
                ].map(card => (
                  <div key={card.title} onClick={() => setView(card.view)} style={{ background: '#12121a', border: `1px solid ${card.color}25`, borderRadius: 16, padding: '22px 20px', cursor: 'pointer', transition: 'all 0.18s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = card.color + '60')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = card.color + '25')}
                  >
                    <div style={{ fontSize: 30, marginBottom: 12 }}>{card.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{card.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65, marginBottom: 14 }}>{card.desc}</div>
                    <div style={{ fontSize: 12, color: card.color, fontWeight: 700 }}>{card.btn} →</div>
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>📊 QA Industry Snapshot 2025–2026</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'Average SDET salary (US)', value: '$125k', trend: '+12% YoY', color: '#6366f1' },
                    { label: 'AI Quality roles (YoY growth)', value: '+340%', trend: 'Fastest growing', color: '#a855f7' },
                    { label: 'Companies hiring remotely', value: '68%', trend: 'of QA openings', color: '#10b981' },
                    { label: 'Manual-only QA roles (trend)', value: '-24%', trend: 'Declining fast', color: '#ef4444' },
                    { label: 'Security QA median salary', value: '$138k', trend: '+8% YoY', color: '#f59e0b' },
                    { label: 'Time to SDET from manual QA', value: '4–6 mo', trend: 'With focused learning', color: '#06b6d4' },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${stat.color}20`, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600, marginBottom: 3 }}>{stat.label}</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>{stat.trend}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ QUIZ ═══ */}
          {view === 'quiz' && quizStep < quizQuestions.length && (
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>Question {quizStep + 1} of {quizQuestions.length}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20 }}>
                  <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #6366f1, #a855f7)', width: `${((quizStep) / quizQuestions.length) * 100}%`, transition: 'width 0.4s' }} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.4 }}>{quizQuestions[quizStep].q}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quizQuestions[quizStep].options.map((opt, i) => (
                  <button key={i} onClick={() => handleQuizAnswer(opt.scores)} style={{
                    width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                    background: '#12121a', border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 14, color: '#e2e8f0', lineHeight: 1.5, transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = '#12121a'; }}
                  >
                    <span style={{ color: '#6366f1', fontWeight: 800, marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ QUIZ RESULT ═══ */}
          {view === 'result' && topResult && (
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{topResult.icon}</div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Your Best Career Match</div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: topResult.color, margin: '0 0 8px' }}>{topResult.title}</h1>
                <div style={{ fontSize: 15, color: '#94a3b8', marginBottom: 20 }}>{topResult.subtitle}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px' }}>{topResult.description}</div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: '💰 Salary Range', value: topResult.salaryRange },
                    { label: '📈 Demand', value: topResult.demandTrend },
                    { label: '⏱️ Time to Switch', value: topResult.timeToSwitch },
                  ].map(stat => (
                    <div key={stat.label} style={{ padding: '10px 18px', background: `${topResult.color}12`, border: `1px solid ${topResult.color}30`, borderRadius: 10 }}>
                      <div style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{stat.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: topResult.color }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 3 */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>Your Top 3 Matches</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {top3.map((p, i) => (
                    <div key={p.id} onClick={() => { setSelectedPath(p); setView('paths'); }} style={{ padding: '8px 16px', borderRadius: 10, cursor: 'pointer', background: `${p.color}12`, border: `1px solid ${p.color}35`, display: 'flex', align: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#475569' }}>#{i + 1}</span>
                      <span style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>{p.icon} {p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills needed */}
              <div style={{ background: '#12121a', border: `1px solid ${topResult.color}25`, borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 12 }}>🛠️ Skills to Build</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {topResult.skills.map(s => (
                    <span key={s} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, background: `${topResult.color}15`, color: topResult.color, border: `1px solid ${topResult.color}30` }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => { setView('switch'); }} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: `${topResult.color}18`, border: `1px solid ${topResult.color}35`, color: topResult.color }}>
                  📋 See My Switch Plan →
                </button>
                <button onClick={() => { setQuizStep(0); setScores({}); setView('quiz'); }} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                  🔄 Retake Quiz
                </button>
              </div>
            </div>
          )}

          {/* ═══ ALL CAREER PATHS ═══ */}
          {view === 'paths' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🗺️ QA Career Paths</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14 }}>Every specialisation available to QA professionals — with real salary data, day-in-the-life, and who each path is right for.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {careerPaths.map(path => (
                  <div key={path.id} style={{ background: '#12121a', border: `1px solid ${selectedPath?.id === path.id ? path.color + '50' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.18s' }}>
                    <div onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)} style={{ padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: `${path.color}18`, border: `1px solid ${path.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{path.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{path.title}</span>
                          <span style={{ fontSize: 11, color: '#475569' }}>{path.subtitle}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: path.color, fontWeight: 700 }}>{path.salaryRange}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{path.demandTrend}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>Switch in: {path.timeToSwitch}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 200 }}>
                        {path.tags.map(t => <span key={t} style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10, background: `${path.color}12`, color: path.color, border: `1px solid ${path.color}25` }}>{t}</span>)}
                      </div>
                      <span style={{ color: '#475569', fontSize: 14, flexShrink: 0 }}>{selectedPath?.id === path.id ? '▲' : '▼'}</span>
                    </div>
                    {selectedPath?.id === path.id && (
                      <div style={{ padding: '0 22px 22px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: '14px 0 18px' }}>{path.description}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>📅 Day in the Life</div>
                            {path.dayInLife.map((d, i) => <div key={i} style={{ fontSize: 12, color: '#64748b', padding: '4px 0', borderBottom: i < path.dayInLife.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>→ {d}</div>)}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>✅ Best for</div>
                            {path.bestFor.map((b, i) => <div key={i} style={{ fontSize: 12, color: '#10b981', padding: '3px 0' }}>✓ {b}</div>)}
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', margin: '12px 0 8px' }}>❌ Not ideal for</div>
                            {path.notFor.map((n, i) => <div key={i} style={{ fontSize: 12, color: '#ef4444', padding: '3px 0' }}>✗ {n}</div>)}
                          </div>
                        </div>
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>🛠️ Key Skills to Build</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {path.skills.map(s => <span key={s} style={{ padding: '4px 11px', borderRadius: 20, fontSize: 11, background: `${path.color}12`, color: path.color, border: `1px solid ${path.color}25` }}>{s}</span>)}
                          </div>
                        </div>
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>🏢 Companies Hiring</div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{path.companies.join(' · ')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ CAREER SWITCH ═══ */}
          {view === 'switch' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🔀 Career Switch Step-by-Step Guides</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14 }}>Exact timelines and actions for the most common QA career transitions — what to learn, in what order, and what to avoid.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {switchPaths.map((sp, i) => (
                  <div key={i} style={{ background: '#12121a', border: `1px solid ${selectedSwitch === i ? sp.color + '50' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, overflow: 'hidden' }}>
                    <div onClick={() => setSelectedSwitch(selectedSwitch === i ? null : i)} style={{ padding: '16px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{sp.from}</div>
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, color: sp.color, fontWeight: 700 }}>⏱️ {sp.timeline}</span>
                          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>💰 {sp.salaryJump}</span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>Risk: <span style={{ color: sp.risk === 'Low' || sp.risk === 'Very Low' ? '#10b981' : sp.risk === 'Medium' ? '#f59e0b' : '#ef4444' }}>{sp.risk}</span></span>
                        </div>
                      </div>
                      <span style={{ color: '#475569', fontSize: 14 }}>{selectedSwitch === i ? '▲' : '▼'}</span>
                    </div>
                    {selectedSwitch === i && (
                      <div style={{ padding: '0 22px 22px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {sp.steps.map((step, si) => (
                            <div key={si} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${expandedStep === si * 100 + i ? sp.color + '40' : 'rgba(255,255,255,0.05)'}`, borderRadius: 10, overflow: 'hidden' }}>
                              <div onClick={() => setExpandedStep(expandedStep === si * 100 + i ? null : si * 100 + i)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: `${sp.color}18`, border: `1px solid ${sp.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: sp.color }}>{si + 1}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 10, color: sp.color, fontWeight: 700, marginBottom: 2 }}>{step.week}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{step.title}</div>
                                </div>
                                <span style={{ color: '#475569', fontSize: 12 }}>{expandedStep === si * 100 + i ? '▲' : '▼'}</span>
                              </div>
                              {expandedStep === si * 100 + i && (
                                <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#94a3b8', lineHeight: 1.75, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                  <p style={{ margin: '10px 0 0' }}>{step.detail}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>🚩 Red Flags — What NOT to do</div>
                          {sp.redFlags.map((rf, ri) => <div key={ri} style={{ fontSize: 12, color: '#94a3b8', padding: '3px 0' }}>⚠️ {rf}</div>)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ MARKET TRENDS ═══ */}
          {view === 'market' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>📈 Market Trends — What's Hot, What's Dying</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>Real-time intelligence on where the QA job market is moving — and what you should do about it right now.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {marketTrends.map((t, i) => (
                  <div key={i} style={{ background: '#12121a', border: `1px solid ${expandedTrend === i ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden' }}>
                    <div onClick={() => setExpandedTrend(expandedTrend === i ? null : i)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{t.direction}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{t.trend}</div>
                        <div style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, display: 'inline-block', background: t.urgency.includes('now') ? 'rgba(239,68,68,0.15)' : t.urgency.includes('ROI') ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.urgency.includes('now') ? '#ef4444' : t.urgency.includes('ROI') ? '#10b981' : '#f59e0b', fontWeight: 700 }}>⏰ {t.urgency}</div>
                      </div>
                      <span style={{ color: '#475569', fontSize: 14 }}>{expandedTrend === i ? '▲' : '▼'}</span>
                    </div>
                    {expandedTrend === i && (
                      <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: '12px 0 14px' }}>{t.detail}</p>
                        <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 9 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>✅ What to do: </span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{t.action}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SALARY GUIDE ═══ */}
          {view === 'salary' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>💰 Salary Guide — Know Your Worth</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>Salary ranges for every QA specialisation by experience level. Use this in negotiations — most QA engineers are underpaid relative to market rate.</p>

              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                      {['Role', 'Junior (0–2yr)', 'Mid (2–5yr)', 'Senior (5–8yr)', 'Lead/Principal'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#a5b4fc', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {[
                        { role: '🎭 Manual QA', j: '$45–65k', m: '$65–90k', s: '$80–110k', l: '$100–130k', color: '#64748b' },
                        { role: '⚙️ SDET', j: '$75–95k', m: '$95–135k', s: '$130–165k', l: '$155–200k', color: '#6366f1' },
                        { role: '🤖 AI Quality Eng.', j: '$90–115k', m: '$115–155k', s: '$150–190k', l: '$180–240k', color: '#a855f7' },
                        { role: '🛡️ Security QA', j: '$80–105k', m: '$105–145k', s: '$140–175k', l: '$170–220k', color: '#ef4444' },
                        { role: '📊 Performance Eng.', j: '$70–95k', m: '$95–130k', s: '$125–160k', l: '$155–195k', color: '#10b981' },
                        { role: '📱 Mobile QA', j: '$65–85k', m: '$85–115k', s: '$110–145k', l: '$140–175k', color: '#06b6d4' },
                        { role: '🔄 DevOps QA', j: '$75–100k', m: '$100–140k', s: '$135–170k', l: '$165–210k', color: '#f97316' },
                        { role: '👑 QA Lead/Manager', j: '—', m: '$90–120k', s: '$115–155k', l: '$145–200k', color: '#f59e0b' },
                      ].map((row, i) => (
                        <tr key={row.role} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '11px 16px', color: row.color, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.role}</td>
                          <td style={{ padding: '11px 16px', color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.j}</td>
                          <td style={{ padding: '11px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.m}</td>
                          <td style={{ padding: '11px 16px', color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 600 }}>{row.s}</td>
                          <td style={{ padding: '11px 16px', color: row.color, borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 800 }}>{row.l}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: '#475569' }}>
                  * US salaries in USD. Data from LinkedIn, Glassdoor, Levels.fyi, and direct job postings 2024–2025. Remote roles at top companies may exceed these ranges.
                </div>
              </div>

              {/* Negotiation tips */}
              <div style={{ background: '#12121a', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24', marginBottom: 14 }}>💡 Salary Negotiation Playbook for QA Engineers</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { tip: 'Never give a number first', detail: 'When asked for your salary expectation, say: "I\'m flexible based on the full comp package — what is the budgeted range for this role?" Most companies have a range 20-30% higher than their first offer.' },
                    { tip: 'Quantify your impact in numbers', detail: 'Don\'t say "I improved test coverage." Say: "I built an automation suite that reduced regression time from 4 hours to 23 minutes and caught 3 production bugs before release."' },
                    { tip: 'AI and security skills are worth $15–40k more', detail: 'If you have even basic AI testing or security testing skills, explicitly position this. Companies pay a massive premium for QA engineers who can test AI systems or find security vulnerabilities.' },
                    { tip: 'Remote roles from US/UK companies pay 2-4× local rates', detail: 'If you\'re outside the US/UK, targeting remote roles at US companies can multiply your earnings. Strong English, a GitHub portfolio, and automation skills are the unlock.' },
                    { tip: 'Counter every offer at least once', detail: 'Studies show 85% of employers expect a counteroffer and have budget to go higher. Countering costs you nothing and often yields $5–20k more.' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 9 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', marginBottom: 5 }}>→ {item.tip}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ RISK ASSESSMENT ═══ */}
          {view === 'risk' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>⚠️ Is Your QA Role at Risk?</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>Honest assessment of which QA skills are becoming obsolete and which are becoming more valuable. Know your risk profile before it's too late.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {riskFactors.map((rf, i) => (
                  <div key={i} style={{ background: '#12121a', border: `1px solid ${expandedRisk === i ? rf.color + '50' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, overflow: 'hidden' }}>
                    <div onClick={() => setExpandedRisk(expandedRisk === i ? null : i)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, background: `${rf.color}15`, color: rf.color, border: `1px solid ${rf.color}30`, flexShrink: 0 }}>{rf.risk}</div>
                      <div style={{ flex: 1, fontSize: 13, color: '#e2e8f0' }}>{rf.factor}</div>
                      <span style={{ color: '#475569', fontSize: 12 }}>{expandedRisk === i ? '▲' : '▼'}</span>
                    </div>
                    {expandedRisk === i && (
                      <div style={{ padding: '0 18px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginTop: 10, padding: '10px 14px', background: `${rf.color}09`, border: `1px solid ${rf.color}25`, borderRadius: 9 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: rf.color }}>✅ Action: </span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{rf.action}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Timeline warning */}
              <div style={{ background: '#12121a', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 14 }}>🕐 The Automation Timeline for QA Jobs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { year: 'Now – 2026', status: '🔴 At Risk', jobs: 'Basic regression execution, click-through testing, simple bug reporting from scripts' },
                    { year: '2026 – 2027', status: '🟡 Declining', jobs: 'Low-complexity exploratory testing, basic Selenium scripting, test case documentation' },
                    { year: '2026 – 2028', status: '🟢 Growing', jobs: 'SDET, AI Quality, Security QA, Performance Engineering, QAOps, QA Leadership' },
                    { year: '2028+', status: '🚀 Premium', jobs: 'AI system testing, autonomous test strategy, LLM red-teaming, compliance QA for AI systems' },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 90, flexShrink: 0 }}>
                        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{row.year}</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>{row.status}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{row.jobs}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px 20px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>💬 The Bottom Line</div>
                <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.75 }}>
                  QA is <strong style={{ color: '#e2e8f0' }}>not</strong> going away — but it is fundamentally changing. The engineers who will thrive are those who treat QA as a technical discipline, write code, understand systems deeply, and embrace AI as a productivity multiplier rather than a threat. The best time to upskill was two years ago. The second best time is today.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
