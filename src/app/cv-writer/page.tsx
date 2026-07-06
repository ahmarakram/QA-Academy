'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

/* ─── Types ────────────────────────────────────────────────── */
interface PersonalInfo {
  name: string; email: string; countryCode: string; phone: string; location: string;
  linkedin: string; github: string; website: string;
}

const COUNTRY_CODES = [
  { code: '+1',   flag: '🇺🇸', country: 'US / Canada' },
  { code: '+44',  flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+92',  flag: '🇵🇰', country: 'Pakistan' },
  { code: '+91',  flag: '🇮🇳', country: 'India' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+974', flag: '🇶🇦', country: 'Qatar' },
  { code: '+965', flag: '🇰🇼', country: 'Kuwait' },
  { code: '+973', flag: '🇧🇭', country: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', country: 'Oman' },
  { code: '+49',  flag: '🇩🇪', country: 'Germany' },
  { code: '+33',  flag: '🇫🇷', country: 'France' },
  { code: '+39',  flag: '🇮🇹', country: 'Italy' },
  { code: '+34',  flag: '🇪🇸', country: 'Spain' },
  { code: '+31',  flag: '🇳🇱', country: 'Netherlands' },
  { code: '+46',  flag: '🇸🇪', country: 'Sweden' },
  { code: '+47',  flag: '🇳🇴', country: 'Norway' },
  { code: '+45',  flag: '🇩🇰', country: 'Denmark' },
  { code: '+41',  flag: '🇨🇭', country: 'Switzerland' },
  { code: '+48',  flag: '🇵🇱', country: 'Poland' },
  { code: '+61',  flag: '🇦🇺', country: 'Australia' },
  { code: '+64',  flag: '🇳🇿', country: 'New Zealand' },
  { code: '+65',  flag: '🇸🇬', country: 'Singapore' },
  { code: '+60',  flag: '🇲🇾', country: 'Malaysia' },
  { code: '+62',  flag: '🇮🇩', country: 'Indonesia' },
  { code: '+63',  flag: '🇵🇭', country: 'Philippines' },
  { code: '+66',  flag: '🇹🇭', country: 'Thailand' },
  { code: '+84',  flag: '🇻🇳', country: 'Vietnam' },
  { code: '+880', flag: '🇧🇩', country: 'Bangladesh' },
  { code: '+94',  flag: '🇱🇰', country: 'Sri Lanka' },
  { code: '+977', flag: '🇳🇵', country: 'Nepal' },
  { code: '+20',  flag: '🇪🇬', country: 'Egypt' },
  { code: '+234', flag: '🇳🇬', country: 'Nigeria' },
  { code: '+27',  flag: '🇿🇦', country: 'South Africa' },
  { code: '+254', flag: '🇰🇪', country: 'Kenya' },
  { code: '+212', flag: '🇲🇦', country: 'Morocco' },
  { code: '+213', flag: '🇩🇿', country: 'Algeria' },
  { code: '+90',  flag: '🇹🇷', country: 'Turkey' },
  { code: '+98',  flag: '🇮🇷', country: 'Iran' },
  { code: '+964', flag: '🇮🇶', country: 'Iraq' },
  { code: '+961', flag: '🇱🇧', country: 'Lebanon' },
  { code: '+962', flag: '🇯🇴', country: 'Jordan' },
  { code: '+82',  flag: '🇰🇷', country: 'South Korea' },
  { code: '+81',  flag: '🇯🇵', country: 'Japan' },
  { code: '+86',  flag: '🇨🇳', country: 'China' },
  { code: '+7',   flag: '🇷🇺', country: 'Russia' },
  { code: '+380', flag: '🇺🇦', country: 'Ukraine' },
  { code: '+55',  flag: '🇧🇷', country: 'Brazil' },
  { code: '+52',  flag: '🇲🇽', country: 'Mexico' },
  { code: '+54',  flag: '🇦🇷', country: 'Argentina' },
  { code: '+56',  flag: '🇨🇱', country: 'Chile' },
  { code: '+57',  flag: '🇨🇴', country: 'Colombia' },
];
interface Job {
  title: string; company: string; startDate: string; endDate: string; current: boolean; location: string;
}
interface Education {
  degree: string; institution: string; year: string; grade: string;
}
interface ResumeData {
  personal: PersonalInfo;
  targetTitle: string;
  yearsExp: string;
  prompt: string;
  keywords: string;
  jobs: Job[];
  education: Education[];
  certs: string;
  languages: string;
}

/* ─── Smart Resume Engine ───────────────────────────────────── */
const roleTemplates: Record<string, { summary: string[]; bullets: string[][] }> = {
  qa: {
    summary: [
      'Results-driven QA Engineer with {years} years of experience designing and executing comprehensive test strategies across web, mobile, and API layers.',
      'Expert in automation frameworks using Playwright, Selenium, and Cypress, with a strong track record of reducing regression time by up to 70%.',
      'Passionate about shift-left testing, CI/CD integration, and building quality-first engineering cultures.',
    ],
    bullets: [
      ['Designed and maintained an end-to-end Playwright automation suite covering {count}+ test cases, reducing manual regression effort by 65%', 'Integrated test pipelines into GitHub Actions CI/CD, enabling automated test runs on every pull request and blocking failing builds from merging', 'Led root-cause analysis of flaky tests, reducing intermittent failures from 18% to under 2% through smart waits and test-data isolation'],
      ['Developed comprehensive API test suites using Postman/Newman, achieving 95% coverage across all REST endpoints', 'Performed exploratory and risk-based testing, identifying 40+ critical defects pre-production across 3 major product releases', 'Collaborated with developers in daily standups and sprint planning to embed quality practices into the SDLC from day one'],
      ['Built and maintained a BDD test framework using Cucumber and Playwright, enabling product owners to contribute acceptance criteria directly as test scenarios', 'Conducted performance testing with k6, establishing baseline benchmarks and identifying a database bottleneck causing P95 response times exceeding 2 seconds', 'Mentored 3 junior QA engineers in automation best practices, code reviews, and test strategy planning'],
    ],
  },
  sdet: {
    summary: [
      'Senior SDET with {years} years of experience architecting scalable test automation frameworks and quality engineering pipelines for enterprise-grade applications.',
      'Deep expertise in designing Page Object Model frameworks, writing maintainable TypeScript/Java test code, and integrating quality gates into DevOps pipelines.',
      'Experienced in leading QA guilds, standardising testing practices across multiple squads, and driving 0-defect production release strategies.',
    ],
    bullets: [
      ['Architected a reusable Playwright + TypeScript test framework adopted by 5 engineering squads, reducing per-team setup time from 2 weeks to 2 days', 'Designed a parallel test sharding strategy across 8 CI workers, cutting full regression suite time from 45 minutes to 6 minutes', 'Built a custom test reporting dashboard using Allure and Grafana, providing real-time quality metrics visible to all stakeholders'],
      ['Engineered contract testing with Pact to catch API breaking changes before integration testing, eliminating a class of production incidents', 'Implemented visual regression testing with Percy, preventing UI regressions across 12 supported browsers and viewports', 'Led a migration from Selenium + JUnit to Playwright + TypeScript, improving test stability from 78% to 97% pass rate in CI'],
      ['Established a test data management strategy using factory patterns and database seeding, eliminating flakiness caused by shared state', 'Championed test-driven development practices, increasing unit test coverage from 34% to 82% across the core services', 'Defined and enforced quality gates in the deployment pipeline, reducing production defect escape rate by 60% year-over-year'],
    ],
  },
  developer: {
    summary: [
      'Full-Stack Software Engineer with {years} years of experience building high-performance web applications using modern JavaScript frameworks and cloud-native architectures.',
      'Proficient in React, Node.js, TypeScript, and AWS, with a strong emphasis on clean code, TDD, and collaborative agile delivery.',
      'Proven track record of delivering scalable features that serve millions of users while maintaining sub-100ms API response times.',
    ],
    bullets: [
      ['Developed a real-time notification system using WebSockets and Redis Pub/Sub, reducing user-perceived latency from 3 seconds to under 200ms', 'Refactored a monolithic REST API into domain-driven microservices, improving deployment independence and reducing service downtime by 40%', 'Built a component library in React and Storybook adopted across 4 product teams, ensuring design consistency and reducing UI development time by 30%'],
      ['Optimised PostgreSQL query performance through indexing and query rewriting, reducing dashboard load time from 8 seconds to 1.2 seconds for a 10M-row dataset', 'Implemented CI/CD pipelines using GitHub Actions and AWS CodeDeploy, enabling 15+ safe production deployments per week', 'Led a TypeScript migration of a 150k-line JavaScript codebase, eliminating an entire class of runtime type errors and improving developer onboarding time'],
      ['Integrated third-party payment processing via Stripe API, handling £2M+ in monthly transactions with full PCI compliance', 'Designed and implemented role-based access control (RBAC) system supporting 8 permission levels across a multi-tenant SaaS platform', 'Mentored 2 junior engineers through pair programming, code reviews, and weekly 1-on-1 sessions, accelerating their promotion to mid-level within 12 months'],
    ],
  },
  devops: {
    summary: [
      'DevOps/Platform Engineer with {years} years of experience building cloud-native infrastructure, CI/CD pipelines, and developer productivity tooling on AWS and GCP.',
      'Expert in Kubernetes, Terraform, Docker, and GitHub Actions with a focus on reliability engineering, cost optimisation, and zero-downtime deployments.',
      'Track record of reducing deployment frequency from monthly to daily while improving system availability to 99.95%.',
    ],
    bullets: [
      ['Migrated a 20-service microservices architecture from EC2 to Kubernetes (EKS), reducing infrastructure costs by 35% and improving deployment speed by 4x', 'Designed multi-region disaster recovery strategy with RTO of 15 minutes and RPO of 5 minutes, tested quarterly via chaos engineering exercises', 'Built GitOps deployment pipelines using ArgoCD and Helm, enabling fully auditable, reproducible deployments across dev/staging/production'],
      ['Implemented Terraform infrastructure-as-code for all AWS resources, enabling environment reproducibility and eliminating configuration drift', 'Established SLO/SLA monitoring using Prometheus, Grafana, and PagerDuty, reducing MTTR from 45 minutes to 8 minutes', 'Automated certificate management and secret rotation using HashiCorp Vault, eliminating manual credential hygiene across 40+ services'],
      ['Optimised Docker image build pipeline using multi-stage builds and layer caching, reducing average CI build time from 18 minutes to 4 minutes', 'Led production incident response for a database failover affecting 200k users, restoring service in 11 minutes with zero data loss', 'Designed and delivered internal DevOps bootcamp for 12 developers, covering containerisation, observability, and on-call best practices'],
    ],
  },
  data: {
    summary: [
      'Data Engineer / Analyst with {years} years of experience designing data pipelines, analytics platforms, and ML feature stores that power data-driven decision making.',
      'Proficient in Python, SQL, Spark, dbt, Airflow, and Snowflake, with hands-on experience delivering end-to-end analytics projects from raw ingestion to executive dashboards.',
      'Strong communicator who bridges the gap between engineering and business stakeholders to deliver actionable insights.',
    ],
    bullets: [
      ['Built a real-time data pipeline using Apache Kafka and Spark Streaming, processing 500k events/minute with sub-second latency for a fraud detection system', 'Designed a Snowflake data warehouse schema and dbt transformation layer, replacing 200+ ad-hoc SQL queries with versioned, tested data models', 'Delivered a customer churn prediction model using scikit-learn achieving 84% precision, enabling the retention team to reduce monthly churn by 18%'],
      ['Automated ETL workflows using Apache Airflow, replacing 15 manual scripts and eliminating weekly data quality incidents that had affected 6 downstream teams', 'Built Tableau and Looker dashboards used by 50+ business stakeholders to monitor KPIs, reducing ad-hoc report requests to the data team by 70%', 'Implemented Great Expectations data quality framework across all critical pipelines, catching schema drift and null violations before they reached production'],
      ['Optimised a Spark job processing 2TB of daily clickstream data, reducing runtime from 3 hours to 22 minutes through partitioning and broadcast joins', 'Led a data governance initiative establishing data ownership, lineage documentation, and access controls across 80+ datasets in the data lake', 'Collaborated with ML engineers to build feature engineering pipelines using Feast, reducing model training data preparation time from 2 days to 4 hours'],
    ],
  },
  management: {
    summary: [
      'Experienced Engineering Manager and Technical Lead with {years} years of experience building and scaling high-performing software teams in fast-growth product companies.',
      'Skilled in hiring, mentoring, agile delivery, and cross-functional stakeholder management, with a consistent track record of shipping complex products on time and within scope.',
      'Passionate about creating psychological safety, building engineering culture, and aligning team goals with business outcomes.',
    ],
    bullets: [
      ['Led a team of 12 engineers across 3 squads delivering a platform serving 2M+ daily active users, achieving 99.9% uptime and shipping features every 2 weeks', 'Hired and onboarded 8 engineers over 18 months, reducing average time-to-productivity from 6 weeks to 3 weeks through structured onboarding and buddy programmes', 'Defined quarterly OKRs aligned to product roadmap, running fortnightly goal reviews that kept 90% of team objectives on track'],
      ['Drove adoption of trunk-based development and feature flags, enabling the team to deploy 20+ times per day with zero production incidents attributable to deployments', 'Introduced engineering health metrics (DORA metrics) and presented monthly scorecards to CTO, creating data-driven conversations about technical debt and velocity', 'Resolved a cross-team dependency deadlock by facilitating an architecture review, unblocking 3 squads and recovering a 4-week schedule slip'],
      ['Championed a 20% innovation time policy that produced 2 internal tools now used company-wide, improving developer productivity by an estimated 15%', 'Ran bi-annual team offsites and weekly 1-on-1s using structured frameworks, achieving 96% retention on the team over 2 years', 'Partnered with Product and Design on a roadmap reprioritisation that refocused engineering capacity on highest-value customer problems, increasing NPS by 12 points'],
    ],
  },
};

function detectRole(keywords: string, title: string): string {
  const text = (keywords + ' ' + title).toLowerCase();
  if (text.match(/sdet|senior.*(qa|test)|test.*architect|automation.*architect/)) return 'sdet';
  if (text.match(/qa|quality|test|playwright|cypress|selenium|appium|testing/)) return 'qa';
  if (text.match(/devops|platform|kubernetes|terraform|docker|k8s|infrastructure|sre|reliability/)) return 'devops';
  if (text.match(/data|analytics|pipeline|spark|sql|snowflake|ml|machine learning|python/)) return 'data';
  if (text.match(/manager|lead|head of|vp|director|engineering manager|cto/)) return 'management';
  return 'developer';
}

function extractSkills(keywords: string): string[][] {
  const kw = keywords.toLowerCase();
  const categories: Record<string, string[]> = {};

  const testing = ['playwright', 'cypress', 'selenium', 'appium', 'jest', 'vitest', 'pytest', 'testng', 'junit', 'mocha', 'chai', 'webdriverio', 'postman', 'newman', 'k6', 'jmeter', 'gatling', 'burp suite', 'zap'];
  const languages = ['javascript', 'typescript', 'python', 'java', 'c#', 'go', 'ruby', 'kotlin', 'swift', 'rust', 'scala', 'php'];
  const frontend = ['react', 'next.js', 'vue', 'angular', 'html', 'css', 'tailwind', 'svelte', 'redux', 'graphql'];
  const backend = ['node.js', 'express', 'fastapi', 'django', 'spring', 'rest api', 'microservices', 'grpc', 'kafka', 'rabbitmq'];
  const cloud = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'github actions', 'jenkins', 'circleci', 'argocd'];
  const data = ['sql', 'postgresql', 'mongodb', 'redis', 'snowflake', 'spark', 'airflow', 'dbt', 'tableau', 'looker', 'pandas', 'scikit-learn'];
  const tools = ['git', 'jira', 'confluence', 'figma', 'slack', 'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'pair programming'];

  const found = {
    'Testing & QA': testing.filter(t => kw.includes(t)),
    'Languages': languages.filter(t => kw.includes(t)),
    'Frontend': frontend.filter(t => kw.includes(t)),
    'Backend': backend.filter(t => kw.includes(t)),
    'Cloud & DevOps': cloud.filter(t => kw.includes(t)),
    'Data & Databases': data.filter(t => kw.includes(t)),
    'Tools & Methods': tools.filter(t => kw.includes(t)),
  };

  // Build result: only non-empty categories
  return Object.entries(found)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => [k, ...v.map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))]);
}

function buildSummary(prompt: string, keywords: string, title: string, years: string): string {
  const role = detectRole(keywords, title);
  const tpl = roleTemplates[role] ?? roleTemplates.developer;
  let summary = tpl.summary.join(' ').replace('{years}', years || '3+');
  if (prompt.trim().length > 20) {
    // Blend user's own words into final sentence
    const userSentence = prompt.trim().replace(/[.!?]+$/, '');
    summary += ` ${userSentence.charAt(0).toUpperCase() + userSentence.slice(1)}.`;
  }
  return summary;
}

function buildBullets(job: Job, keywords: string, jobIndex: number): string[] {
  const role = detectRole(keywords, job.title);
  const tpl = roleTemplates[role] ?? roleTemplates.developer;
  const set = tpl.bullets[jobIndex % tpl.bullets.length];
  return set.map(b => b.replace('{count}', String(80 + Math.floor(Math.random() * 120))));
}

/* ─── PDF Generator ─────────────────────────────────────────── */
async function downloadPDF(data: ResumeData) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210; const ML = 18; const MR = 18; const TW = W - ML - MR;
  let y = 0;

  const role = detectRole(data.keywords, data.targetTitle);
  const skills = extractSkills(data.keywords);
  const summary = buildSummary(data.prompt, data.keywords, data.targetTitle, data.yearsExp);

  // ── Colour header band ─────────────────────────────────────
  doc.setFillColor(30, 30, 50);
  doc.rect(0, 0, W, 42, 'F');

  // Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(data.personal.name || 'Your Name', ML, 16);

  // Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 220);
  doc.text(data.targetTitle || 'Professional Title', ML, 24);

  // Contact line
  const fullPhone = data.personal.phone ? `${data.personal.countryCode} ${data.personal.phone}` : '';
  const contacts = [data.personal.email, fullPhone, data.personal.location].filter(Boolean);
  if (data.personal.linkedin) contacts.push('linkedin.com/in/' + data.personal.linkedin.replace(/.*linkedin\.com\/in\//i, ''));
  if (data.personal.github) contacts.push('github.com/' + data.personal.github.replace(/.*github\.com\//i, ''));
  doc.setFontSize(8.5);
  doc.setTextColor(160, 160, 200);
  doc.text(contacts.join('   •   '), ML, 33);

  // Accent line
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(1.2);
  doc.line(0, 42, W, 42);

  y = 52;

  function section(title: string) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(99, 102, 241);
    doc.text(title.toUpperCase(), ML, y);
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.4);
    doc.line(ML, y + 1.5, ML + TW, y + 1.5);
    y += 7;
    doc.setTextColor(30, 30, 30);
  }

  function body(text: string, indent = 0, bold = false) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, TW - indent);
    if (y + lines.length * 5 > 280) { doc.addPage(); y = 20; }
    doc.text(lines, ML + indent, y);
    y += lines.length * 5 + 1;
  }

  function gap(n = 4) { y += n; }

  // ── Professional Summary ───────────────────────────────────
  section('Professional Summary');
  body(summary);
  gap();

  // ── Skills ────────────────────────────────────────────────
  if (skills.length > 0) {
    section('Core Skills & Technologies');
    for (const [cat, ...items] of skills) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 80);
      doc.text(cat + ':', ML, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const skillLine = items.join(' · ');
      const lines = doc.splitTextToSize(skillLine, TW - 38);
      doc.text(lines, ML + 38, y);
      y += Math.max(lines.length * 4.5, 5);
    }
    gap(3);
  }

  // ── Work Experience ───────────────────────────────────────
  if (data.jobs.filter(j => j.company).length > 0) {
    section('Professional Experience');
    data.jobs.filter(j => j.company).forEach((job, i) => {
      const dateStr = `${job.startDate} – ${job.current ? 'Present' : job.endDate}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(job.title || 'Role', ML, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 140);
      doc.text(dateStr, W - MR, y, { align: 'right' });
      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 100);
      doc.text((job.company || '') + (job.location ? '  ·  ' + job.location : ''), ML, y);
      y += 6;
      const bullets = buildBullets(job, data.keywords, i);
      bullets.forEach(b => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.2);
        doc.setTextColor(40, 40, 40);
        doc.text('•', ML + 1, y);
        const lines = doc.splitTextToSize(b, TW - 8);
        if (y + lines.length * 4.8 > 280) { doc.addPage(); y = 20; }
        doc.text(lines, ML + 6, y);
        y += lines.length * 4.8 + 1;
      });
      gap(4);
    });
  }

  // ── Education ─────────────────────────────────────────────
  if (data.education.filter(e => e.institution).length > 0) {
    section('Education');
    data.education.filter(e => e.institution).forEach(edu => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      doc.text(edu.degree || 'Degree', ML, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 140);
      doc.text(edu.year || '', W - MR, y, { align: 'right' });
      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80, 80, 100);
      doc.text((edu.institution || '') + (edu.grade ? '  ·  ' + edu.grade : ''), ML, y);
      y += 7;
    });
  }

  // ── Certifications ─────────────────────────────────────────
  if (data.certs.trim()) {
    section('Certifications');
    data.certs.split('\n').filter(Boolean).forEach(c => {
      body('• ' + c.trim());
    });
    gap(2);
  }

  // ── Languages ─────────────────────────────────────────────
  if (data.languages.trim()) {
    section('Languages');
    body(data.languages);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 180, 180);
    doc.text(`${data.personal.name} — ${data.targetTitle}`, ML, 293);
    doc.text(`Page ${p} of ${pageCount}`, W - MR, 293, { align: 'right' });
  }

  doc.save(`${(data.personal.name || 'Resume').replace(/\s+/g, '_')}_CV.pdf`);
}

/* ─── DOCX Generator ────────────────────────────────────────── */
async function downloadDOCX(data: ResumeData) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType, TabStopType, TabStopLeader } = await import('docx');

  const skills = extractSkills(data.keywords);
  const summary = buildSummary(data.prompt, data.keywords, data.targetTitle, data.yearsExp);

  const accentColor = '6366F1';
  const darkColor = '1E1E32';

  function hr() {
    return new Paragraph({
      border: { bottom: { color: accentColor, space: 1, style: BorderStyle.SINGLE, size: 12 } },
      spacing: { before: 0, after: 100 },
      children: [],
    });
  }

  function sectionHeading(text: string) {
    return new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), bold: true, color: accentColor, size: 20, font: 'Calibri' })],
      spacing: { before: 300, after: 80 },
      border: { bottom: { color: accentColor, space: 1, style: BorderStyle.SINGLE, size: 8 } },
    });
  }

  function bullet(text: string) {
    return new Paragraph({
      bullet: { level: 0 },
      children: [new TextRun({ text, size: 19, font: 'Calibri', color: '2D2D2D' })],
      spacing: { before: 40, after: 40 },
    });
  }

  function bodyText(text: string) {
    return new Paragraph({
      children: [new TextRun({ text, size: 19, font: 'Calibri', color: '2D2D2D' })],
      spacing: { before: 40, after: 40 },
    });
  }

  const children: any[] = [
    // Name
    new Paragraph({
      children: [new TextRun({ text: data.personal.name || 'Your Name', bold: true, size: 52, color: darkColor, font: 'Calibri' })],
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 60 },
      shading: { type: ShadingType.CLEAR, fill: 'F5F5FF' },
    }),
    // Title
    new Paragraph({
      children: [new TextRun({ text: data.targetTitle || 'Professional Title', size: 28, color: accentColor, bold: true, font: 'Calibri' })],
      spacing: { before: 0, after: 80 },
    }),
    // Contact
    new Paragraph({
      children: [
        new TextRun({ text: [data.personal.email, data.personal.phone ? `${data.personal.countryCode} ${data.personal.phone}` : '', data.personal.location, data.personal.linkedin, data.personal.github].filter(Boolean).join('   |   '), size: 17, color: '555577', font: 'Calibri' })
      ],
      spacing: { before: 0, after: 200 },
      border: { bottom: { color: accentColor, space: 1, style: BorderStyle.SINGLE, size: 12 } },
    }),

    // Summary
    sectionHeading('Professional Summary'),
    bodyText(summary),

    // Skills
    ...(skills.length > 0 ? [
      sectionHeading('Core Skills & Technologies'),
      ...skills.map(([cat, ...items]) => new Paragraph({
        children: [
          new TextRun({ text: cat + ': ', bold: true, size: 19, font: 'Calibri', color: '333355' }),
          new TextRun({ text: items.join(' · '), size: 19, font: 'Calibri', color: '2D2D2D' }),
        ],
        spacing: { before: 40, after: 40 },
      })),
    ] : []),

    // Experience
    ...(data.jobs.filter(j => j.company).length > 0 ? [
      sectionHeading('Professional Experience'),
      ...data.jobs.filter(j => j.company).flatMap((job, i) => [
        new Paragraph({
          children: [
            new TextRun({ text: job.title || 'Role', bold: true, size: 22, font: 'Calibri', color: darkColor }),
            new TextRun({ text: '    ' + `${job.startDate} – ${job.current ? 'Present' : job.endDate}`, size: 18, font: 'Calibri', color: '888899' }),
          ],
          spacing: { before: 200, after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: (job.company || '') + (job.location ? '  ·  ' + job.location : ''), italics: true, size: 19, font: 'Calibri', color: '555577' })],
          spacing: { before: 0, after: 80 },
        }),
        ...buildBullets(job, data.keywords, i).map(b => bullet(b)),
      ]),
    ] : []),

    // Education
    ...(data.education.filter(e => e.institution).length > 0 ? [
      sectionHeading('Education'),
      ...data.education.filter(e => e.institution).flatMap(edu => [
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: 21, font: 'Calibri', color: darkColor }),
            new TextRun({ text: '    ' + (edu.year || ''), size: 18, font: 'Calibri', color: '888899' }),
          ],
          spacing: { before: 160, after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: (edu.institution || '') + (edu.grade ? '  ·  ' + edu.grade : ''), italics: true, size: 19, font: 'Calibri', color: '555577' })],
          spacing: { before: 0, after: 60 },
        }),
      ]),
    ] : []),

    // Certifications
    ...(data.certs.trim() ? [
      sectionHeading('Certifications'),
      ...data.certs.split('\n').filter(Boolean).map(c => bullet(c.trim())),
    ] : []),

    // Languages
    ...(data.languages.trim() ? [
      sectionHeading('Languages'),
      bodyText(data.languages),
    ] : []),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 20 } },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(data.personal.name || 'Resume').replace(/\s+/g, '_')}_CV.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── UI Component ──────────────────────────────────────────── */
const STEPS = ['Personal Info', 'Target Role', 'Work History', 'Education', 'Preview'];
const emptyJob = (): Job => ({ title: '', company: '', startDate: '', endDate: '', current: false, location: '' });
const emptyEdu = (): Education => ({ degree: '', institution: '', year: '', grade: '' });

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)',
  borderRadius: 10, color: '#e2e8f0', fontSize: 13.5, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 5, display: 'block' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };

export default function CVWriterPage() {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState<'pdf' | 'docx' | null>(null);
  const [data, setData] = useState<ResumeData>({
    personal: { name: '', email: '', countryCode: '+44', phone: '', location: '', linkedin: '', github: '', website: '' },
    targetTitle: '', yearsExp: '', prompt: '', keywords: '',
    jobs: [emptyJob(), emptyJob()],
    education: [emptyEdu()],
    certs: '', languages: '',
  });

  function p(field: keyof PersonalInfo, val: string) {
    setData(d => ({ ...d, personal: { ...d.personal, [field]: val } }));
  }
  function updateJob(i: number, field: keyof Job, val: string | boolean) {
    setData(d => { const jobs = [...d.jobs]; jobs[i] = { ...jobs[i], [field]: val }; return { ...d, jobs }; });
  }
  function updateEdu(i: number, field: keyof Education, val: string) {
    setData(d => { const education = [...d.education]; education[i] = { ...education[i], [field]: val }; return { ...d, education }; });
  }

  async function handleDownload(type: 'pdf' | 'docx') {
    setGenerating(type);
    try {
      if (type === 'pdf') await downloadPDF(data);
      else await downloadDOCX(data);
    } finally {
      setGenerating(null);
    }
  }

  const role = detectRole(data.keywords, data.targetTitle);
  const previewSkills = extractSkills(data.keywords);
  const previewSummary = buildSummary(data.prompt, data.keywords, data.targetTitle, data.yearsExp);

  return (
    <AppShell>
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'inherit', padding: '28px 24px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}>📄</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>CV / Resume Writer</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>AI-powered · Professional formatting · PDF & DOCX export</p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginTop: 24, overflowX: 'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => i < step + 1 && setStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 10,
                  background: step === i ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: step === i ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                  cursor: i <= step ? 'pointer' : 'default',
                  color: step === i ? '#a5b4fc' : i < step ? '#10b981' : '#475569',
                  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: step === i ? '#6366f1' : i < step ? '#10b981' : 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: i <= step ? '#fff' : '#475569',
                  flexShrink: 0,
                }}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ width: 24, height: 1, background: i < step ? '#10b981' : 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card wrapper */}
      <div style={{
        background: 'rgba(20,20,35,0.7)', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 20, padding: '32px 36px', maxWidth: 820, backdropFilter: 'blur(20px)',
      }}>

        {/* ── Step 0: Personal Info ─────────────────────────────── */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginTop: 0, marginBottom: 6 }}>Personal Information</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>This goes at the top of your resume.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} value={data.personal.name} onChange={e => p('name', e.target.value)} placeholder="e.g. Sarah Al-Rashid" />
              </div>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input style={inputStyle} value={data.personal.email} onChange={e => p('email', e.target.value)} placeholder="sarah@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={data.personal.countryCode}
                      onChange={e => p('countryCode', e.target.value)}
                      style={{
                        ...inputStyle, width: 'auto', flexShrink: 0, paddingRight: 10,
                        cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
                        background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.35)',
                        fontFamily: 'inherit', minWidth: 110,
                      }}
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code + c.country} value={c.code}
                          style={{ background: '#1e1e32', color: '#e2e8f0' }}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      value={data.personal.phone}
                      onChange={e => p('phone', e.target.value)}
                      placeholder="7700 900000"
                      type="tel"
                    />
                  </div>
                  {data.personal.phone && (
                    <div style={{ fontSize: 11, color: '#6366f1', marginTop: 5 }}>
                      {COUNTRY_CODES.find(c => c.code === data.personal.countryCode)?.flag}{' '}
                      Full number: {data.personal.countryCode} {data.personal.phone}
                    </div>
                  )}
                </div>
              </div>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={data.personal.location} onChange={e => p('location', e.target.value)} placeholder="London, UK" />
                </div>
                <div>
                  <label style={labelStyle}>LinkedIn URL or Username</label>
                  <input style={inputStyle} value={data.personal.linkedin} onChange={e => p('linkedin', e.target.value)} placeholder="linkedin.com/in/sarah" />
                </div>
              </div>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>GitHub Username</label>
                  <input style={inputStyle} value={data.personal.github} onChange={e => p('github', e.target.value)} placeholder="sarahalrashid" />
                </div>
                <div>
                  <label style={labelStyle}>Portfolio / Website</label>
                  <input style={inputStyle} value={data.personal.website} onChange={e => p('website', e.target.value)} placeholder="sarahdev.io" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Target Role ───────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginTop: 0, marginBottom: 6 }}>Target Role & AI Context</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>Tell us about the role you're applying for. The more keywords you paste from the job description, the better the AI can tailor your resume.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Target Job Title *</label>
                  <input style={inputStyle} value={data.targetTitle} onChange={e => setData(d => ({ ...d, targetTitle: e.target.value }))} placeholder="e.g. Senior QA Automation Engineer" />
                </div>
                <div>
                  <label style={labelStyle}>Years of Experience</label>
                  <input style={inputStyle} value={data.yearsExp} onChange={e => setData(d => ({ ...d, yearsExp: e.target.value }))} placeholder="e.g. 5" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Brief About Yourself (optional prompt)</label>
                <textarea
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={data.prompt}
                  onChange={e => setData(d => ({ ...d, prompt: e.target.value }))}
                  placeholder="e.g. I'm a QA engineer specialising in Playwright automation at fintech companies. I led a team of 4 testers and reduced regression time by 70%."
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Job Description Keywords *
                  <span style={{ fontWeight: 400, color: '#475569', marginLeft: 8 }}>Paste the job description or just list key skills</span>
                </label>
                <textarea
                  rows={7}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={data.keywords}
                  onChange={e => setData(d => ({ ...d, keywords: e.target.value }))}
                  placeholder="Paste the job description here, or list the skills/keywords:&#10;&#10;Playwright, TypeScript, CI/CD, GitHub Actions, API testing, Agile, JIRA, performance testing, k6, Selenium, SDET..."
                />
              </div>
              {data.keywords.length > 10 && (
                <div style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  fontSize: 12, color: '#10b981',
                }}>
                  ✓ Detected role type: <strong>{role.toUpperCase()}</strong> · Found {extractSkills(data.keywords).length} skill categories · Resume will be tailored to this profile
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2: Work History ──────────────────────────────── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginTop: 0, marginBottom: 6 }}>Work History</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>Add your positions. Achievement bullet points will be AI-generated from your keywords — you just need the job details.</p>
            {data.jobs.map((job, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.12)',
                borderRadius: 14, padding: '20px 22px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 14 }}>
                  Position {i + 1} {i > 1 && <span style={{ color: '#334155', fontWeight: 400 }}>(optional)</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={gridStyle}>
                    <div>
                      <label style={labelStyle}>Job Title</label>
                      <input style={inputStyle} value={job.title} onChange={e => updateJob(i, 'title', e.target.value)} placeholder="e.g. Senior QA Engineer" />
                    </div>
                    <div>
                      <label style={labelStyle}>Company</label>
                      <input style={inputStyle} value={job.company} onChange={e => updateJob(i, 'company', e.target.value)} placeholder="e.g. Monzo Bank" />
                    </div>
                  </div>
                  <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div>
                      <label style={labelStyle}>Start Date</label>
                      <input style={inputStyle} value={job.startDate} onChange={e => updateJob(i, 'startDate', e.target.value)} placeholder="Jan 2022" />
                    </div>
                    <div>
                      <label style={labelStyle}>End Date</label>
                      <input style={inputStyle} value={job.endDate} onChange={e => updateJob(i, 'endDate', e.target.value)} placeholder="Dec 2024" disabled={job.current} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94a3b8' }}>
                        <input type="checkbox" checked={job.current} onChange={e => updateJob(i, 'current', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
                        Current role
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Location</label>
                    <input style={inputStyle} value={job.location} onChange={e => updateJob(i, 'location', e.target.value)} placeholder="London, UK  /  Remote" />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setData(d => ({ ...d, jobs: [...d.jobs, emptyJob()] }))}
              style={{
                padding: '8px 18px', borderRadius: 10, border: '1px dashed rgba(99,102,241,0.3)',
                background: 'transparent', color: '#6366f1', fontSize: 13, cursor: 'pointer',
              }}
            >+ Add another position</button>
          </div>
        )}

        {/* ── Step 3: Education & Extras ────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginTop: 0, marginBottom: 6 }}>Education & Extras</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>Add your qualifications, certifications, and languages.</p>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc', marginBottom: 14 }}>Education</div>
              {data.education.map((edu, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.12)',
                  borderRadius: 14, padding: '20px 22px', marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={gridStyle}>
                      <div>
                        <label style={labelStyle}>Degree / Qualification</label>
                        <input style={inputStyle} value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="BSc Computer Science" />
                      </div>
                      <div>
                        <label style={labelStyle}>Institution</label>
                        <input style={inputStyle} value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="University of Manchester" />
                      </div>
                    </div>
                    <div style={gridStyle}>
                      <div>
                        <label style={labelStyle}>Graduation Year</label>
                        <input style={inputStyle} value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} placeholder="2020" />
                      </div>
                      <div>
                        <label style={labelStyle}>Grade / GPA (optional)</label>
                        <input style={inputStyle} value={edu.grade} onChange={e => updateEdu(i, 'grade', e.target.value)} placeholder="2:1 / First Class / 3.8 GPA" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setData(d => ({ ...d, education: [...d.education, emptyEdu()] }))}
                style={{ padding: '8px 18px', borderRadius: 10, border: '1px dashed rgba(99,102,241,0.3)', background: 'transparent', color: '#6366f1', fontSize: 13, cursor: 'pointer' }}
              >+ Add qualification</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ ...labelStyle, fontSize: 14, color: '#a5b4fc', marginBottom: 10 }}>Certifications</label>
              <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={data.certs}
                onChange={e => setData(d => ({ ...d, certs: e.target.value }))}
                placeholder="One per line:&#10;ISTQB Foundation Level (2023)&#10;AWS Certified Developer Associate&#10;QA Academy SDET Professional" />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 14, color: '#a5b4fc', marginBottom: 10 }}>Languages</label>
              <input style={inputStyle} value={data.languages}
                onChange={e => setData(d => ({ ...d, languages: e.target.value }))}
                placeholder="English (Native) · Urdu (Fluent) · Spanish (Conversational)" />
            </div>
          </div>
        )}

        {/* ── Step 4: Preview & Download ────────────────────────── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginTop: 0, marginBottom: 6 }}>Preview & Download</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Your AI-generated resume is ready. Download as PDF or DOCX.</p>

            {/* Download buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              <button
                onClick={() => handleDownload('pdf')}
                disabled={!!generating}
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: 14,
                  background: generating === 'pdf' ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                  border: 'none', color: '#fff', fontWeight: 700, fontSize: 14.5,
                  cursor: generating ? 'wait' : 'pointer',
                  boxShadow: generating ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {generating === 'pdf' ? '⏳ Generating PDF…' : '⬇ Download PDF'}
              </button>
              <button
                onClick={() => handleDownload('docx')}
                disabled={!!generating}
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: 14,
                  background: generating === 'docx' ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
                  border: '1.5px solid rgba(16,185,129,0.4)',
                  color: '#10b981', fontWeight: 700, fontSize: 14.5,
                  cursor: generating ? 'wait' : 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {generating === 'docx' ? '⏳ Generating DOCX…' : '⬇ Download DOCX'}
              </button>
            </div>

            {/* Live preview card */}
            <div style={{
              background: '#fff', borderRadius: 14, padding: '36px 40px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)', color: '#1e1e32', fontFamily: 'Georgia, serif',
              maxHeight: 600, overflowY: 'auto',
            }}>
              {/* Header */}
              <div style={{ background: '#1e1e32', margin: '-36px -40px 24px', padding: '24px 40px 20px' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'sans-serif' }}>{data.personal.name || 'Your Name'}</div>
                <div style={{ fontSize: 14, color: '#a5b4fc', fontFamily: 'sans-serif', marginTop: 4 }}>{data.targetTitle || 'Professional Title'}</div>
                <div style={{ fontSize: 11, color: '#6366f1', marginTop: 8, fontFamily: 'sans-serif' }}>
                  {[data.personal.email, data.personal.phone ? `${data.personal.countryCode} ${data.personal.phone}` : '', data.personal.location, data.personal.linkedin].filter(Boolean).join('   •   ')}
                </div>
              </div>

              {/* Summary */}
              {previewSummary && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', borderBottom: '1px solid #6366f1', paddingBottom: 3, marginBottom: 8, fontFamily: 'sans-serif' }}>PROFESSIONAL SUMMARY</div>
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: '#2d2d4e', margin: 0 }}>{previewSummary}</p>
                </div>
              )}

              {/* Skills */}
              {previewSkills.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', borderBottom: '1px solid #6366f1', paddingBottom: 3, marginBottom: 8, fontFamily: 'sans-serif' }}>CORE SKILLS</div>
                  {previewSkills.map(([cat, ...items]) => (
                    <div key={cat} style={{ fontSize: 11.5, marginBottom: 4, lineHeight: 1.5 }}>
                      <strong style={{ color: '#333355', fontFamily: 'sans-serif' }}>{cat}: </strong>
                      <span style={{ color: '#2d2d2d' }}>{items.join(' · ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {data.jobs.filter(j => j.company).length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', borderBottom: '1px solid #6366f1', paddingBottom: 3, marginBottom: 10, fontFamily: 'sans-serif' }}>PROFESSIONAL EXPERIENCE</div>
                  {data.jobs.filter(j => j.company).map((job, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: 13, color: '#1e1e32', fontFamily: 'sans-serif' }}>{job.title}</strong>
                        <span style={{ fontSize: 10, color: '#888', fontFamily: 'sans-serif' }}>{job.startDate} – {job.current ? 'Present' : job.endDate}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#555577', fontStyle: 'italic', marginBottom: 6, fontFamily: 'sans-serif' }}>{job.company}{job.location ? ' · ' + job.location : ''}</div>
                      {buildBullets(job, data.keywords, i).map((b, bi) => (
                        <div key={bi} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                          <span style={{ color: '#6366f1', flexShrink: 0, fontSize: 11 }}>•</span>
                          <span style={{ fontSize: 11.5, color: '#2d2d2d', lineHeight: 1.55 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {data.education.filter(e => e.institution).length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', borderBottom: '1px solid #6366f1', paddingBottom: 3, marginBottom: 8, fontFamily: 'sans-serif' }}>EDUCATION</div>
                  {data.education.filter(e => e.institution).map((edu, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: 12, fontFamily: 'sans-serif' }}>{edu.degree}</strong>
                        <span style={{ fontSize: 10, color: '#888', fontFamily: 'sans-serif' }}>{edu.year}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#555577', fontStyle: 'italic', fontFamily: 'sans-serif' }}>{edu.institution}{edu.grade ? ' · ' + edu.grade : ''}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certs */}
              {data.certs.trim() && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', borderBottom: '1px solid #6366f1', paddingBottom: 3, marginBottom: 8, fontFamily: 'sans-serif' }}>CERTIFICATIONS</div>
                  {data.certs.split('\n').filter(Boolean).map((c, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: '#2d2d2d', marginBottom: 3 }}>• {c}</div>
                  ))}
                </div>
              )}
            </div>

            <p style={{ fontSize: 11.5, color: '#475569', marginTop: 14, textAlign: 'center' }}>
              💡 The downloaded files are fully formatted and ATS-optimised. Open the DOCX in Word to make manual edits.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              padding: '10px 24px', borderRadius: 12,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: step === 0 ? '#334155' : '#94a3b8', fontSize: 13.5, cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >← Back</button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{
                padding: '10px 28px', borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none', color: '#fff', fontSize: 13.5, cursor: 'pointer',
                fontWeight: 700, boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}
            >
              {step === STEPS.length - 2 ? '✨ Generate Resume →' : 'Next →'}
            </button>
          ) : (
            <button
              onClick={() => setStep(0)}
              style={{
                padding: '10px 24px', borderRadius: 12,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc', fontSize: 13.5, cursor: 'pointer', fontWeight: 600,
              }}
            >↺ Start Over</button>
          )}
        </div>
      </div>
    </div>
    </AppShell>
  );
}
