'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import AppShell from '@/components/AppShell';

interface Scene {
  id: string;
  duration: number;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  narration: string;
  bullets: string[];
  visual: 'dashboard' | 'learning' | 'quiz' | 'capstone' | 'aiTutor' | 'career' | 'cicd' | 'cvWriter' | 'certifications' | 'interview' | 'automation' | 'pricing';
}

const SCENES: Scene[] = [
  {
    id: 'intro', duration: 12, title: 'Welcome to QA Academy', subtitle: 'The AI-Powered QA Learning Platform',
    icon: '🧪', accent: '#6366f1',
    narration: 'Welcome to QA Academy — the most comprehensive AI-powered platform for software testing professionals. Whether you are a complete beginner or a senior QA engineer, we have everything you need to grow faster and land better roles.',
    bullets: ['21 structured learning modules', 'AI tutor available 24/7', 'Real capstone projects with bugs to find', 'Professional certifications recognised by employers'],
    visual: 'dashboard',
  },
  {
    id: 'dashboard', duration: 13, title: 'Your Learning Dashboard', subtitle: 'Track XP, streaks, badges and progress at a glance',
    icon: '🏠', accent: '#10b981',
    narration: 'Your Dashboard is command central. Every day a fresh challenge awaits you — complete it to earn XP and keep your streak alive. Track your level, modules completed, certifications earned, and the 12 achievement badges you can unlock.',
    bullets: ['Daily challenges refresh every 24 hours', 'Streak counter rewards consistency', '12 unlockable achievement badges', 'XP level system from Beginner to QA Lead'],
    visual: 'dashboard',
  },
  {
    id: 'learning', duration: 14, title: 'Structured Learning Path', subtitle: '21 modules from Beginner to QA Lead',
    icon: '📚', accent: '#8b5cf6',
    narration: 'The Learning Path covers everything: QA fundamentals, test case design, web automation, API testing, database testing, performance testing, security testing, AI testing, SDET skills, and QA leadership. 21 modules across 5 levels, each earning you XP and building toward certifications.',
    bullets: ['5 progression levels: Beginner to QA Lead', 'Modules cover all modern QA domains', 'Interactive reading with worked examples', 'Feeds directly into Quiz and Certification'],
    visual: 'learning',
  },
  {
    id: 'quiz', duration: 12, title: 'Quiz Center', subtitle: 'Practice Mode and timed Exam Mode',
    icon: '🎯', accent: '#f59e0b',
    narration: 'The Quiz Center has two modes. Practice Mode shows the explanation after every answer — perfect while studying. Exam Mode is timed and simulates the real certification format. The Weak Areas filter serves only questions from topics where you score below 70%, closing knowledge gaps efficiently.',
    bullets: ['Practice Mode with instant explanations', 'Timed Exam Mode for certification prep', 'Weak Areas filter targets your gaps', 'Score 80% or above to earn full XP'],
    visual: 'quiz',
  },
  {
    id: 'capstone', duration: 15, title: 'Capstone Projects', subtitle: 'Find real bugs in simulated apps',
    icon: '🏆', accent: '#ef4444',
    narration: 'Capstone Projects are the most hands-on feature on the platform. Each workspace is a simulated live application with deliberately planted bugs. You explore as a real tester would, find the bugs, file proper bug reports, and execute test cases. There are 5 projects from Beginner E-Commerce to Advanced Multi-Tenant SaaS — covering functional, AI quality, security, mobile, and performance testing.',
    bullets: ['5 real-world project workspaces', 'Test App, Bug Tracker, Test Cases, Report tabs', 'Bugs are hidden — find them yourself', 'Scored on bugs found + test case coverage'],
    visual: 'capstone',
  },
  {
    id: 'aiTutor', duration: 13, title: 'Khirad — AI Tutor', subtitle: 'Full platform knowledge, instant answers',
    icon: '🤖', accent: '#a855f7',
    narration: 'Khirad is your AI tutor with encyclopedic knowledge of the entire platform, every QA concept, all automation tools, CI/CD pipelines, career intelligence, and interview preparation. Ask anything and get a detailed, accurate answer. Follow-up chips guide you deeper into any topic without you having to think of what to ask next.',
    bullets: ['Knows the full QA Academy curriculum', '16 suggested starter questions', 'Follow-up chips guide deeper learning', 'Use for mock interview practice'],
    visual: 'aiTutor',
  },
  {
    id: 'certifications', duration: 11, title: 'Professional Certifications', subtitle: '8 certificates downloadable as PDF',
    icon: '🏅', accent: '#f59e0b',
    narration: 'Complete the prerequisite modules and pass the timed certification exam to earn a professional certificate. 8 certifications are available, from QA Fundamentals to SDET Specialist and AI Quality Engineer. Download your certificate as a professionally formatted PDF and share it directly to LinkedIn in one click.',
    bullets: ['8 professional certifications available', '40-60 question timed exam format', 'Download professional PDF certificate', 'One-click LinkedIn sharing'],
    visual: 'certifications',
  },
  {
    id: 'interview', duration: 11, title: 'Interview Prep', subtitle: '200+ real QA questions with model answers',
    icon: '💼', accent: '#3b82f6',
    narration: 'Interview Prep contains over 200 real QA interview questions, all tagged by topic and seniority level. Filter by Junior, Mid-Level, Senior, or Lead. Cover technical topics like automation frameworks and API testing, plus behavioural STAR method questions. Use Khirad to run live mock interviews for the most effective preparation.',
    bullets: ['200+ questions across all QA domains', 'Filter by seniority level', 'Detailed model answers for every question', 'STAR method behavioural question coverage'],
    visual: 'interview',
  },
  {
    id: 'career', duration: 14, title: 'Career Intelligence', subtitle: 'Salary data, risk assessment, switch guides',
    icon: '🚀', accent: '#ec4899',
    narration: 'Career Intelligence is your strategic advisor. Start with the 6-question Career Quiz to discover which QA specialisation best matches your goals. Then explore 7 detailed career path profiles with salary ranges by experience level. The Risk Assessment scores your current role on 8 factors. The Career Switch Guide gives you a month-by-month plan for 4 common transitions.',
    bullets: ['Career Quiz matches you to 7 specialisations', 'Salary tables for 8 roles × 4 levels', 'Risk Assessment scores your job security', 'Month-by-month career switch plans'],
    visual: 'career',
  },
  {
    id: 'cicd', duration: 12, title: 'CI/CD & GitHub', subtitle: 'Pipeline integration for automated tests',
    icon: '🔄', accent: '#14b8a6',
    narration: 'The CI/CD section teaches you to wire automated tests into delivery pipelines — the most in-demand QA skill today. Interactive pipeline stage diagrams, production-ready YAML examples you can copy directly, and guides for Playwright, API tests, and performance tests in GitHub Actions.',
    bullets: ['Interactive 8-stage pipeline diagram', 'Copy-ready GitHub Actions YAML', 'Playwright, API, and performance in CI', 'Real-world production examples'],
    visual: 'cicd',
  },
  {
    id: 'automation', duration: 11, title: 'Automation Tools & AI IDEs', subtitle: 'Playwright, Cypress, Selenium, k6, Claude Code',
    icon: '🧪', accent: '#f97316',
    narration: 'Full installation and usage guides for every major tool: Playwright, Cypress, Selenium, Jest, Postman, k6, and Appium. Plus a dedicated AI Tools section covering Claude Code, GitHub Copilot, and Cursor IDE, with a library of ready-made prompts optimised for QA engineers.',
    bullets: ['7 automation frameworks covered', 'OS-specific install commands', '6 AI-powered QA workflow guides', 'Copy-ready prompt library'],
    visual: 'automation',
  },
  {
    id: 'cvWriter', duration: 13, title: 'AI Resume / CV Writer', subtitle: 'Keyword-driven, downloadable as PDF and DOCX',
    icon: '📄', accent: '#6366f1',
    narration: 'The CV Writer generates a complete, professionally formatted resume tailored to any job description. Enter your details, paste the job keywords, and it generates a tailored professional summary, role-specific skill section, and three achievement bullet points per job automatically. Export to both PDF with purple accent styling and Word DOCX that you can edit directly.',
    bullets: ['Smart role detection from job keywords', 'AI-generated achievement bullet points', 'Download as PDF or editable DOCX', 'Country code + phone number field'],
    visual: 'cvWriter',
  },
  {
    id: 'pricing', duration: 11, title: 'Pricing & Plans', subtitle: 'From free to enterprise — grow at your pace',
    icon: '💎', accent: '#10b981',
    narration: 'QA Academy starts free — no credit card needed. The free Basic plan includes all 21 modules, the full Quiz Center, one certification, and Khirad with 10 messages per day. Pro unlocks everything for 29 dollars per month. Enterprise adds team dashboards, custom learning paths, and dedicated support for QA teams.',
    bullets: ['Basic plan free — no card needed', 'Pro at $29/month unlocks all features', 'Enterprise for teams from $99/user', 'Upgrade anytime, cancel anytime'],
    visual: 'pricing',
  },
];

const TOTAL_DURATION = SCENES.reduce((s, sc) => s + sc.duration, 0);

function VisualDashboard({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 4 }}>
      {[
        { label: 'Total XP', value: '4,280', icon: '✨', color: '#a5b4fc' },
        { label: 'Level', value: 'Advanced', icon: '⚡', color: '#f59e0b' },
        { label: 'Modules', value: '14/21', icon: '📚', color: '#10b981' },
        { label: 'Streak', value: '7 days 🔥', icon: '🔥', color: '#ef4444' },
      ].map((item, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: 12,
          border: `1px solid ${accent}30`, padding: '14px 16px',
        }}>
          <div style={{ fontSize: 20 }}>{item.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: item.color, marginTop: 6 }}>{item.value}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.label}</div>
        </div>
      ))}
      <div style={{ gridColumn: '1/-1', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: `1px solid ${accent}25`, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Today&apos;s Daily Challenge</div>
        <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600 }}>Write 3 test cases for a login form with edge cases</div>
        <div style={{ marginTop: 10, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 10 }}>
          <div style={{ height: '100%', width: '60%', background: `linear-gradient(90deg, ${accent}, #a855f7)`, borderRadius: 10 }} />
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>+35 XP on completion</div>
      </div>
    </div>
  );
}

function VisualLearning({ accent }: { accent: string }) {
  const modules = [
    { name: 'QA Fundamentals', level: 'Beginner', done: true },
    { name: 'Test Case Design', level: 'Beginner', done: true },
    { name: 'Web Testing', level: 'Intermediate', done: true },
    { name: 'API Testing', level: 'Intermediate', active: true },
    { name: 'Playwright', level: 'Advanced', done: false },
    { name: 'SDET Skills', level: 'Expert', done: false },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {modules.map((m, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: m.active ? `${accent}18` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${m.active ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 10, padding: '10px 14px',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: m.done ? '#10b981' : m.active ? accent : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: 'white',
          }}>{m.done ? '✓' : m.active ? '▶' : ''}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: m.active ? '#e2e8f0' : m.done ? '#94a3b8' : '#64748b', fontWeight: m.active ? 700 : 400 }}>{m.name}</div>
            <div style={{ fontSize: 10, color: '#334155' }}>{m.level}</div>
          </div>
          {m.done && <span style={{ fontSize: 10, color: '#10b981' }}>✓ Complete</span>}
          {m.active && <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>In Progress</span>}
        </div>
      ))}
    </div>
  );
}

function VisualQuiz({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 16 }}>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>Question 7 of 20 · API Testing</div>
        <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.5 }}>What HTTP status code indicates a resource was successfully created?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          {['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'].map((opt, i) => (
            <div key={i} style={{
              padding: '9px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              background: i === 1 ? `${accent}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === 1 ? accent + '50' : 'rgba(255,255,255,0.06)'}`,
              color: i === 1 ? '#c7d2fe' : '#64748b',
              fontWeight: i === 1 ? 600 : 400,
            }}>{opt}</div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>85%</div>
          <div style={{ fontSize: 10, color: '#475569' }}>Current Score</div>
        </div>
        <div style={{ flex: 1, background: `${accent}12`, border: `1px solid ${accent}25`, borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>6/7</div>
          <div style={{ fontSize: 10, color: '#475569' }}>Correct</div>
        </div>
      </div>
    </div>
  );
}

function VisualCapstone({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Test App', 'Bug Tracker', 'Test Cases', 'Report'].map((tab, i) => (
          <div key={i} style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 11,
            background: i === 1 ? `${accent}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 1 ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
            color: i === 1 ? '#c7d2fe' : '#475569',
            fontWeight: i === 1 ? 700 : 400,
          }}>{tab}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Bug Reports (3 found)</div>
          <span style={{ fontSize: 10, color: '#10b981' }}>3/6 found</span>
        </div>
        {[
          { id: 'BUG-001', title: 'Cart total does not update when quantity changes', sev: 'High' },
          { id: 'BUG-002', title: 'Promo code accepts expired codes', sev: 'Critical' },
          { id: 'BUG-003', title: 'Email validation accepts invalid format', sev: 'Medium' },
        ].map((bug, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{ fontSize: 10, color: accent, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{bug.id}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{bug.title}</span>
            <span style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 20,
              background: bug.sev === 'Critical' ? '#ef444420' : bug.sev === 'High' ? '#f9731620' : '#f59e0b20',
              color: bug.sev === 'Critical' ? '#ef4444' : bug.sev === 'High' ? '#f97316' : '#f59e0b',
              fontWeight: 700, flexShrink: 0,
            }}>{bug.sev}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 10 }}>
        <div style={{ height: '100%', width: '50%', background: `linear-gradient(90deg, ${accent}, #a855f7)`, borderRadius: 10 }} />
      </div>
      <div style={{ fontSize: 11, color: '#475569' }}>Overall score: 50% — keep exploring the app!</div>
    </div>
  );
}

function VisualAITutor({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
        <div style={{ background: 'rgba(30,30,50,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '4px 14px 14px 14px', padding: '12px 14px', fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.6, flex: 1 }}>
          The difference between <strong style={{ color: '#c7d2fe' }}>smoke testing</strong> and <strong style={{ color: '#c7d2fe' }}>sanity testing</strong>: Smoke testing is a broad, shallow check to confirm a new build is stable enough for deeper testing. Sanity testing is a narrow, focused check to verify a specific bug fix or feature works as expected before regression testing.
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 40 }}>
        {['When do I run each?', 'Give me test examples', 'What about regression?'].map((q, i) => (
          <div key={i} style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11,
            background: `${accent}10`, border: `1px solid ${accent}25`, color: '#a5b4fc', cursor: 'pointer',
          }}>{q}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }} />
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '14px 4px 14px 14px', padding: '10px 14px', fontSize: 12.5, color: '#e2e8f0', maxWidth: '70%' }}>
          What are the differences between smoke and sanity testing?
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>👤</div>
      </div>
    </div>
  );
}

function VisualCertifications({ accent }: { accent: string }) {
  const certs = [
    { name: 'QA Fundamentals', status: 'Earned', date: 'Jun 2025' },
    { name: 'Web Automation Engineer', status: 'In Progress', modules: '3/5 modules' },
    { name: 'API Testing Specialist', status: 'Locked', modules: '0/4 modules' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {certs.map((cert, i) => (
        <div key={i} style={{
          background: cert.status === 'Earned' ? `${accent}12` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${cert.status === 'Earned' ? accent + '30' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, fontSize: 18, flexShrink: 0,
            background: cert.status === 'Earned' ? `${accent}20` : 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{cert.status === 'Earned' ? '🏅' : cert.status === 'In Progress' ? '📝' : '🔒'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: cert.status === 'Earned' ? '#e2e8f0' : '#64748b', fontWeight: 600 }}>{cert.name}</div>
            <div style={{ fontSize: 11, color: cert.status === 'Earned' ? '#10b981' : '#475569', marginTop: 3 }}>
              {cert.status === 'Earned' ? `Earned ${cert.date}` : cert.modules}
            </div>
          </div>
          {cert.status === 'Earned' && (
            <div style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#10b98120', border: '1px solid #10b98140', color: '#10b981', fontWeight: 700 }}>Download PDF</div>
          )}
        </div>
      ))}
    </div>
  );
}

function VisualInterview({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['All', 'Fundamentals', 'Automation', 'API', 'Behavioural'].map((f, i) => (
          <div key={i} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11,
            background: i === 0 ? `${accent}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 0 ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
            color: i === 0 ? '#a5b4fc' : '#475569',
          }}>{f}</div>
        ))}
      </div>
      {[
        { q: 'What is the difference between functional and non-functional testing?', level: 'Junior' },
        { q: 'How would you design a test strategy for a mobile app?', level: 'Senior' },
        { q: 'Describe a time you found a critical bug close to release.', level: 'Mid-Level' },
      ].map((item, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '12px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{ fontSize: 12.5, color: '#94a3b8', flex: 1, lineHeight: 1.5 }}>{item.q}</div>
          <span style={{
            fontSize: 9, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
            background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, fontWeight: 700,
          }}>{item.level}</span>
        </div>
      ))}
    </div>
  );
}

function VisualCareer({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: `${accent}12`, border: `1px solid ${accent}30`, borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, color: accent, fontWeight: 700, marginBottom: 8 }}>Your Career Match: SDET</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[{ l: 'Junior', v: '£35–45k' }, { l: 'Mid-Level', v: '£50–65k' }, { l: 'Senior', v: '£70–90k' }, { l: 'Lead', v: '£90–120k' }].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: '#475569' }}>{s.l}</div>
              <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 700 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 14px' }}>
        <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 6 }}>Risk Assessment: MEDIUM</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {['AI tool exposure', 'Automation coverage', 'Market demand'].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 10 }}>
                <div style={{ height: '100%', width: `${[40, 65, 80][i]}%`, background: `${accent}`, borderRadius: 10 }} />
              </div>
              <span style={{ fontSize: 10, color: '#475569', width: 110 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualCICD({ accent }: { accent: string }) {
  const stages = ['Source', 'Build', 'Unit Tests', 'Integration', 'E2E Tests', 'Security', 'Deploy', 'Monitor'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 10,
              background: i <= 4 ? `${accent}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i <= 4 ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
              color: i <= 4 ? '#a5b4fc' : '#334155', fontWeight: i <= 4 ? 700 : 400,
            }}>{s}</div>
            {i < stages.length - 1 && <div style={{ color: '#334155', fontSize: 10 }}>→</div>}
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(20,20,30,0.8)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10, padding: '10px 14px', fontFamily: 'monospace' }}>
        <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>github-actions/e2e.yml</div>
        {['- name: Run Playwright tests', '  uses: actions/setup-node@v4', '  run: npx playwright test', '  env: CI=true'].map((line, i) => (
          <div key={i} style={{ fontSize: 11, color: i === 0 ? '#a5b4fc' : i === 2 ? '#10b981' : '#64748b', paddingLeft: i > 0 ? 16 : 0 }}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function VisualAutomation({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['Playwright', 'Cypress', 'Selenium', 'k6', 'Postman', 'Appium'].map((t, i) => (
          <div key={i} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11,
            background: i === 0 ? `${accent}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 0 ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
            color: i === 0 ? '#a5b4fc' : '#475569', fontWeight: i === 0 ? 700 : 400,
          }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(20,20,30,0.8)', border: `1px solid ${accent}20`, borderRadius: 10, padding: '12px 14px', fontFamily: 'monospace' }}>
        {[
          { t: '# Install Playwright', c: '#475569' },
          { t: 'npm init playwright@latest', c: '#10b981' },
          { t: '', c: '' },
          { t: '# Run all tests', c: '#475569' },
          { t: 'npx playwright test', c: '#10b981' },
          { t: '', c: '' },
          { t: '# View HTML report', c: '#475569' },
          { t: 'npx playwright show-report', c: '#a5b4fc' },
        ].map((l, i) => l.t ? <div key={i} style={{ fontSize: 11, color: l.c, marginBottom: 1 }}>{l.t}</div> : <br key={i} />)}
      </div>
    </div>
  );
}

function VisualCVWriter({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {['1 Personal', '2 Target Role', '3 Work History', '4 Education', '5 Preview'].map((s, i) => (
          <div key={i} style={{
            padding: '5px 10px', borderRadius: 8, fontSize: 10,
            background: i === 2 ? `${accent}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === 2 ? accent + '40' : 'rgba(255,255,255,0.06)'}`,
            color: i === 2 ? '#a5b4fc' : '#334155', fontWeight: i === 2 ? 700 : 400,
          }}>{s}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, color: '#475569', marginBottom: 10, fontWeight: 700 }}>Work History — AI Generated Bullets</div>
        {[
          'Increased test coverage from 42% to 87% by building a Playwright suite of 200+ automated tests, reducing regression time by 70%',
          'Led API testing initiative for payment service, uncovering 12 critical defects pre-launch and preventing estimated £200k in customer-facing issues',
          'Mentored 3 junior QA engineers in automation best practices, enabling the team to scale test output by 3× without additional headcount',
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: i < 2 ? 8 : 0 }}>
            <span style={{ color: accent, flexShrink: 0, marginTop: 2 }}>▸</span>{b}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: `1px solid ${accent}20`, fontSize: 12, color: accent, textAlign: 'center', cursor: 'pointer' }}>⬇ Download PDF</div>
        <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: `${accent}15`, border: `1px solid ${accent}35`, fontSize: 12, color: '#a5b4fc', textAlign: 'center', cursor: 'pointer', fontWeight: 700 }}>📄 Download DOCX</div>
      </div>
    </div>
  );
}

function VisualPricing({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {[
        { name: 'Basic', price: 'Free', color: '#10b981', features: ['All 21 modules', 'Quiz Center', '1 Certification', 'Khirad 10 msg/day'] },
        { name: 'Pro', price: '$29/mo', color: accent, features: ['All 8 certs', 'Unlimited Khirad', 'All projects', 'LinkedIn sharing'], hot: true },
        { name: 'Enterprise', price: '$99/user', color: '#ec4899', features: ['Team dashboard', 'Custom paths', 'Progress tracking', 'SSO'] },
      ].map((plan, i) => (
        <div key={i} style={{
          flex: 1, background: plan.hot ? `${plan.color}12` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${plan.hot ? plan.color + '35' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 14, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 12, color: plan.color, fontWeight: 800 }}>{plan.name}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{plan.price}</div>
          {plan.features.map((f, j) => (
            <div key={j} style={{ fontSize: 10.5, color: '#64748b', display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ color: plan.color }}>✓</span>{f}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SceneVisual({ visual, accent }: { visual: Scene['visual'], accent: string }) {
  switch (visual) {
    case 'dashboard': return <VisualDashboard accent={accent} />;
    case 'learning': return <VisualLearning accent={accent} />;
    case 'quiz': return <VisualQuiz accent={accent} />;
    case 'capstone': return <VisualCapstone accent={accent} />;
    case 'aiTutor': return <VisualAITutor accent={accent} />;
    case 'career': return <VisualCareer accent={accent} />;
    case 'cicd': return <VisualCICD accent={accent} />;
    case 'cvWriter': return <VisualCVWriter accent={accent} />;
    case 'certifications': return <VisualCertifications accent={accent} />;
    case 'interview': return <VisualInterview accent={accent} />;
    case 'automation': return <VisualAutomation accent={accent} />;
    case 'pricing': return <VisualPricing accent={accent} />;
    default: return <VisualDashboard accent={accent} />;
  }
}

export default function VideoTourPage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scene = SCENES[sceneIndex];
  const totalElapsed = SCENES.slice(0, sceneIndex).reduce((s, sc) => s + sc.duration, 0) + sceneElapsed;
  const globalPct = (totalElapsed / TOTAL_DURATION) * 100;
  const scenePct = (sceneElapsed / scene.duration) * 100;

  const speakScene = useCallback((idx: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(SCENES[idx].narration);
    utt.rate = 0.92;
    utt.pitch = 1.0;
    utt.volume = 1;
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, []);

  const goToScene = useCallback((idx: number) => {
    if (idx < 0 || idx >= SCENES.length) return;
    setTransitioning(true);
    setTimeout(() => {
      setSceneIndex(idx);
      setSceneElapsed(0);
      setTransitioning(false);
    }, 300);
  }, []);

  const advanceScene = useCallback(() => {
    if (sceneIndex < SCENES.length - 1) {
      goToScene(sceneIndex + 1);
      if (playing) speakScene(sceneIndex + 1);
    } else {
      setPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }, [sceneIndex, playing, goToScene, speakScene]);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSceneElapsed(prev => {
        const next = prev + 0.1;
        if (next >= scene.duration) {
          clearInterval(intervalRef.current!);
          advanceScene();
          return 0;
        }
        return next;
      });
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, scene.duration, advanceScene]);

  function togglePlay() {
    if (!playing) {
      setPlaying(true);
      speakScene(sceneIndex);
    } else {
      setPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }

  function restart() {
    setPlaying(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSceneIndex(0);
    setSceneElapsed(0);
  }

  function fmtTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <AppShell>
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', color: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        padding: '18px 28px', borderBottom: '1px solid rgba(99,102,241,0.12)',
        background: 'rgba(15,15,25,0.97)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          boxShadow: '0 0 20px rgba(99,102,241,0.35)',
        }}>🎬</div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Product Video Tour</h1>
          <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>2:30 guided walkthrough · {SCENES.length} scenes · Voice narration</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setSubtitleVisible(v => !v)} style={{
            padding: '7px 14px', borderRadius: 10, fontSize: 12, cursor: 'pointer', fontWeight: 600,
            background: subtitleVisible ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${subtitleVisible ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
            color: subtitleVisible ? '#a5b4fc' : '#475569',
          }}>CC {subtitleVisible ? 'On' : 'Off'}</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', gap: 0, maxHeight: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        {/* Main player */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 28px', gap: 20, overflowY: 'auto' }}>
          {/* Scene display */}
          <div style={{
            background: 'rgba(15,15,25,0.95)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: `0 0 40px ${scene.accent}20`,
            transition: 'box-shadow 0.5s',
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
            transitionProperty: 'opacity, transform, box-shadow',
            transitionDuration: '0.3s',
          }}>
            {/* Scene header */}
            <div style={{
              padding: '22px 28px 18px',
              background: `linear-gradient(135deg, ${scene.accent}18, rgba(15,15,25,0))`,
              borderBottom: `1px solid ${scene.accent}20`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 54, height: 54, borderRadius: 16, flexShrink: 0,
                background: `${scene.accent}20`, border: `1px solid ${scene.accent}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                boxShadow: `0 0 20px ${scene.accent}30`,
              }}>{scene.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>{scene.title}</div>
                <div style={{ fontSize: 13, color: scene.accent, marginTop: 3, fontWeight: 600 }}>{scene.subtitle}</div>
              </div>
              <div style={{
                fontSize: 11, padding: '5px 12px', borderRadius: 20, fontWeight: 700,
                background: `${scene.accent}15`, border: `1px solid ${scene.accent}30`, color: scene.accent,
              }}>Scene {sceneIndex + 1}/{SCENES.length}</div>
            </div>

            {/* Subtitle */}
            {subtitleVisible && (
              <div style={{
                padding: '14px 28px', borderBottom: `1px solid ${scene.accent}12`,
                background: 'rgba(0,0,0,0.3)',
              }}>
                <div style={{
                  fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.65,
                  fontStyle: 'italic', opacity: playing ? 1 : 0.6,
                  transition: 'opacity 0.3s',
                }}>&ldquo;{scene.narration}&rdquo;</div>
              </div>
            )}

            {/* Visual area */}
            <div style={{ padding: '20px 28px 24px' }}>
              <SceneVisual visual={scene.visual} accent={scene.accent} />
            </div>

            {/* Bullets */}
            <div style={{
              padding: '16px 28px 22px',
              borderTop: `1px solid ${scene.accent}12`,
              background: 'rgba(0,0,0,0.2)',
              display: 'flex', flexWrap: 'wrap', gap: 8,
            }}>
              {scene.bullets.map((b, i) => (
                <div key={i} style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: 12,
                  background: `${scene.accent}10`, border: `1px solid ${scene.accent}20`,
                  color: scene.accent === '#6366f1' ? '#a5b4fc' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ color: scene.accent, fontSize: 10 }}>✦</span>{b}
                </div>
              ))}
            </div>
          </div>

          {/* Progress + controls */}
          <div style={{
            background: 'rgba(20,20,35,0.7)', border: '1px solid rgba(99,102,241,0.12)',
            borderRadius: 16, padding: '18px 22px',
          }}>
            {/* Scene progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginBottom: 6 }}>
              <span>Scene {sceneIndex + 1}: {scene.title}</span>
              <span>{fmtTime(sceneElapsed)} / {scene.duration}s</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 14, cursor: 'pointer' }}
              onClick={e => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                setSceneElapsed(pct * scene.duration);
              }}>
              <div style={{ height: '100%', width: `${scenePct}%`, background: `linear-gradient(90deg, ${scene.accent}, #a855f7)`, borderRadius: 10, transition: 'width 0.1s linear' }} />
            </div>

            {/* Global progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155', marginBottom: 5 }}>
              <span>Total progress</span>
              <span>{fmtTime(totalElapsed)} / {fmtTime(TOTAL_DURATION)}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ height: '100%', width: `${globalPct}%`, background: 'rgba(99,102,241,0.4)', borderRadius: 10, transition: 'width 0.1s linear' }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <button onClick={restart} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', color: '#475569', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↺</button>
              <button onClick={() => { goToScene(sceneIndex - 1); if (playing) speakScene(sceneIndex - 1); }} disabled={sceneIndex === 0} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', color: sceneIndex === 0 ? '#1e293b' : '#64748b', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏮</button>
              <button onClick={togglePlay} style={{
                background: playing ? `linear-gradient(135deg, ${scene.accent}, #a855f7)` : `${scene.accent}20`,
                border: `1px solid ${scene.accent}40`, borderRadius: 14,
                width: 52, height: 52, cursor: 'pointer', color: playing ? 'white' : scene.accent,
                fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: playing ? `0 0 20px ${scene.accent}40` : 'none',
                transition: 'all 0.2s',
              }}>{playing ? '⏸' : '▶'}</button>
              <button onClick={() => { goToScene(sceneIndex + 1); if (playing) speakScene(sceneIndex + 1); }} disabled={sceneIndex === SCENES.length - 1} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 38, height: 38, cursor: 'pointer', color: sceneIndex === SCENES.length - 1 ? '#1e293b' : '#64748b', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏭</button>
              <div style={{ fontSize: 11, color: '#334155', marginLeft: 8 }}>
                {playing ? '🔊 Narrating…' : '🔇 Paused'}
              </div>
            </div>
          </div>
        </div>

        {/* Scene list sidebar */}
        <div style={{
          borderLeft: '1px solid rgba(99,102,241,0.1)',
          background: 'rgba(10,10,18,0.8)',
          overflowY: 'auto',
          padding: '18px 12px',
        }}>
          <div style={{ fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 6px 12px' }}>All Scenes</div>
          {SCENES.map((sc, i) => {
            const done = i < sceneIndex;
            const active = i === sceneIndex;
            return (
              <button key={sc.id} onClick={() => { goToScene(i); if (playing) speakScene(i); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 12, marginBottom: 4,
                  background: active ? `${sc.accent}15` : 'transparent',
                  border: active ? `1px solid ${sc.accent}35` : '1px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0, fontSize: 14,
                  background: done ? '#10b98120' : active ? `${sc.accent}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${done ? '#10b98130' : active ? sc.accent + '35' : 'rgba(255,255,255,0.06)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: done ? '#10b981' : '#64748b',
                }}>{done ? '✓' : sc.icon}</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: 12, fontWeight: active ? 700 : 400,
                    color: active ? '#e2e8f0' : done ? '#64748b' : '#475569',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{sc.title}</div>
                  <div style={{ fontSize: 10, color: '#334155' }}>{sc.duration}s</div>
                </div>
                {active && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.accent, boxShadow: `0 0 6px ${sc.accent}80`, flexShrink: 0 }} />
                )}
              </button>
            );
          })}
          <div style={{ padding: '16px 8px 4px', borderTop: '1px solid rgba(99,102,241,0.08)', marginTop: 8 }}>
            <div style={{ fontSize: 10, color: '#1e293b', lineHeight: 1.6 }}>
              Voice narration uses your browser&apos;s built-in Web Speech API. Click ▶ to start with audio.
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
