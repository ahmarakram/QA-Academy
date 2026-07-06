'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

/* ─── Data ─────────────────────────────────────────────── */

const sections = [
  { id: 'concepts', icon: '🧠', label: 'Core Concepts' },
  { id: 'github-actions', icon: '⚡', label: 'GitHub Actions' },
  { id: 'playwright-ci', icon: '🎭', label: 'Playwright in CI' },
  { id: 'api-ci', icon: '🔌', label: 'API Tests in CI' },
  { id: 'performance-ci', icon: '📊', label: 'Performance in CI' },
  { id: 'pipeline-stages', icon: '🚀', label: 'Pipeline Stages' },
  { id: 'best-practices', icon: '✅', label: 'Best Practices' },
  { id: 'real-examples', icon: '💼', label: 'Real-World Examples' },
] as const;

type SectionId = typeof sections[number]['id'];

const codeBlocks: Record<string, string> = {

  basic_workflow: `# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test

      - name: Build application
        run: npm run build`,

  playwright_workflow: `# .github/workflows/e2e.yml
name: E2E Tests — Playwright

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  playwright:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]   # Run 4 parallel shards
        shardTotal: [4]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Start application
        run: npm run start &
        env:
          NODE_ENV: test

      - name: Wait for app to be ready
        run: npx wait-on http://localhost:3000 --timeout 60000

      - name: Run Playwright tests (sharded)
        run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
        env:
          CI: true
          BASE_URL: http://localhost:3000

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-\${{ matrix.shardIndex }}
          path: playwright-report/
          retention-days: 30

  merge-reports:
    needs: playwright
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Download all reports
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: playwright-report-*
          merge-multiple: true

      - name: Merge reports
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-merged
          path: playwright-report/`,

  api_test_workflow: `# .github/workflows/api-tests.yml
name: API Tests — Postman / Newman

on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 6 * * *'   # Run daily at 6 AM

jobs:
  api-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra

      - name: Start API server
        run: npm run start:api &
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/testdb
          NODE_ENV: test

      - name: Wait for API
        run: npx wait-on http://localhost:4000/health

      - name: Run Postman collection
        run: |
          newman run ./tests/api/collection.json \\
            --environment ./tests/api/env.staging.json \\
            --reporters cli,htmlextra \\
            --reporter-htmlextra-export ./api-report.html \\
            --bail

      - name: Upload API report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-report
          path: api-report.html`,

  k6_workflow: `# .github/workflows/performance.yml
name: Performance Tests — k6

on:
  push:
    branches: [main]
  workflow_dispatch:   # Allow manual trigger

jobs:
  performance:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring \\
            --keyring /usr/share/keyrings/k6-archive-keyring.gpg \\
            --keyserver hkp://keyserver.ubuntu.com:80 \\
            --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \\
            | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run load test (smoke)
        run: k6 run --vus 5 --duration 30s tests/performance/smoke.js
        env:
          BASE_URL: https://staging.example.com

      - name: Run load test (full)
        if: github.ref == 'refs/heads/main'
        run: k6 run tests/performance/load.js
        env:
          BASE_URL: https://staging.example.com

      - name: Upload k6 results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: k6-results
          path: results.json`,

  k6_script: `// tests/performance/load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const responseTime = new Trend('response_time');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp up to 50 users
    { duration: '5m', target: 50 },    // Hold at 50 users
    { duration: '2m', target: 200 },   // Spike to 200 users
    { duration: '5m', target: 200 },   // Hold spike
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
    response_time: ['avg<300'],        // Average response under 300ms
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

  // Test the homepage
  const home = http.get(\`\${BASE_URL}/\`);
  check(home, {
    'homepage status 200': (r) => r.status === 200,
    'homepage loads fast': (r) => r.timings.duration < 1000,
  });
  responseTime.add(home.timings.duration);
  errorRate.add(home.status !== 200);

  // Test the API
  const payload = JSON.stringify({ email: 'test@example.com', password: 'test123' });
  const login = http.post(\`\${BASE_URL}/api/login\`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(login, {
    'login status 200': (r) => r.status === 200,
    'login returns token': (r) => JSON.parse(r.body).token !== undefined,
  });

  sleep(1);  // Think time between requests
}`,

  playwright_config: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,     // Fail on .only in CI
  retries: process.env.CI ? 2 : 0,  // Retry on CI only
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results.xml' }],
    ['github'],   // GitHub Actions annotations
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  // Start dev server before tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});`,

  full_qa_pipeline: `# .github/workflows/qa-pipeline.yml
# Full QA Pipeline — runs on every PR to main
name: Full QA Pipeline

on:
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  # ── Step 1: Lint & Type Check ──────────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '\${{ env.NODE_VERSION }}', cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  # ── Step 2: Unit Tests ─────────────────────────────────
  unit-tests:
    name: Unit Tests
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '\${{ env.NODE_VERSION }}', cache: npm }
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: \${{ secrets.CODECOV_TOKEN }}

  # ── Step 3: API Tests ──────────────────────────────────
  api-tests:
    name: API Tests
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '\${{ env.NODE_VERSION }}', cache: npm }
      - run: npm ci
      - run: npm run start:api &
      - run: npx wait-on http://localhost:4000/health
      - run: npm run test:api

  # ── Step 4: E2E Tests (parallel shards) ───────────────
  e2e-tests:
    name: E2E Tests
    needs: api-tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shardIndex: [1, 2, 3]
        shardTotal: [3]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '\${{ env.NODE_VERSION }}', cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run start &
      - run: npx wait-on http://localhost:3000
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-report-shard-\${{ matrix.shardIndex }}
          path: playwright-report/

  # ── Step 5: Security Scan ─────────────────────────────
  security:
    name: Security Scan
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run npm audit
        run: npm audit --audit-level=high
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'my-app'
          path: '.'
          format: 'HTML'
      - uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: reports/

  # ── Step 6: Deploy to Staging (if all pass) ───────────
  deploy-staging:
    name: Deploy to Staging
    needs: [e2e-tests, api-tests, security]
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        run: echo "Deploy to staging server"
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}`,

  secrets_example: `# Using Secrets in GitHub Actions
# Never hardcode credentials — use GitHub Secrets

# Set secrets in: Repository → Settings → Secrets → Actions

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests with credentials
        run: npm run test
        env:
          # Access secrets via \${{ secrets.SECRET_NAME }}
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          API_KEY: \${{ secrets.API_KEY }}
          STRIPE_TEST_KEY: \${{ secrets.STRIPE_TEST_KEY }}

      - name: Deploy (production only)
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
        env:
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}`,

  docker_workflow: `# .github/workflows/docker-ci.yml
# Run tests inside a Docker container
name: Docker CI

on: [push, pull_request]

jobs:
  test-in-docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build test image
        run: docker build -t myapp-test --target test .

      - name: Run tests in container
        run: |
          docker run --rm \\
            -e CI=true \\
            -e NODE_ENV=test \\
            myapp-test npm run test

      - name: Run E2E with docker-compose
        run: |
          docker-compose -f docker-compose.test.yml up \\
            --abort-on-container-exit \\
            --exit-code-from tests

# docker-compose.test.yml
# services:
#   app:
#     build: .
#     ports: ["3000:3000"]
#     environment:
#       DATABASE_URL: postgresql://postgres:test@db:5432/testdb
#   db:
#     image: postgres:15
#     environment:
#       POSTGRES_PASSWORD: test
#   tests:
#     build: .
#     command: npm run test:e2e
#     depends_on: [app, db]
#     environment:
#       BASE_URL: http://app:3000`,
};

const pipelineStages = [
  {
    stage: 1, icon: '📝', name: 'Code Push', color: '#6366f1',
    desc: 'Developer pushes code to feature branch or opens a pull request.',
    actions: ['git add .', 'git commit -m "feat: add login feature"', 'git push origin feature/login'],
    trigger: 'Automatic on push/PR',
  },
  {
    stage: 2, icon: '🔍', name: 'Lint & Type Check', color: '#8b5cf6',
    desc: 'Check code quality: ESLint catches style issues, TypeScript catches type errors — before any tests run.',
    actions: ['npm run lint', 'npm run typecheck', 'Blocks merge if failures found'],
    trigger: 'Runs in ~30 seconds',
  },
  {
    stage: 3, icon: '🧪', name: 'Unit Tests', color: '#a855f7',
    desc: 'Run fast unit tests in parallel. Check code coverage meets minimum threshold (e.g. 80%).',
    actions: ['npm run test:unit', 'Jest / Vitest', 'Coverage report uploaded to Codecov'],
    trigger: 'Runs in ~1–2 minutes',
  },
  {
    stage: 4, icon: '🔌', name: 'API Tests', color: '#ec4899',
    desc: 'Spin up the API with a real test database. Run all endpoint tests and contract tests.',
    actions: ['Start API + test DB via docker-compose', 'Newman / pytest', 'Validates all REST endpoints'],
    trigger: 'Runs in ~3–5 minutes',
  },
  {
    stage: 5, icon: '🎭', name: 'E2E Tests', color: '#ef4444',
    desc: 'Run full user journey tests in real browsers. Sharded across 3–4 workers for speed.',
    actions: ['Start app server', 'Playwright across Chrome + Firefox + WebKit', 'Test report uploaded as artifact'],
    trigger: 'Runs in ~5–10 minutes',
  },
  {
    stage: 6, icon: '🛡️', name: 'Security Scan', color: '#f59e0b',
    desc: 'Scan dependencies for known CVEs. Run OWASP checks. Fail on high-severity issues.',
    actions: ['npm audit --audit-level=high', 'OWASP Dependency Check', 'Trivy container scan (if Docker)'],
    trigger: 'Runs in parallel with stage 3',
  },
  {
    stage: 7, icon: '🚀', name: 'Deploy to Staging', color: '#10b981',
    desc: 'All gates passed — auto-deploy to staging environment for human testing.',
    actions: ['Build production bundle', 'Deploy to staging server', 'Smoke test against staging URL'],
    trigger: 'Auto-deploy on merge to main',
  },
  {
    stage: 8, icon: '✅', name: 'Deploy to Production', color: '#14b8a6',
    desc: 'Manual approval gate. QA signs off → deploy to production with zero-downtime strategy.',
    actions: ['Manual approval in GitHub UI', 'Blue/green deployment', 'Post-deploy smoke tests run'],
    trigger: 'Manual gate required',
  },
];

const concepts = [
  {
    title: 'CI — Continuous Integration', icon: '🔄', color: '#6366f1',
    short: 'Automatically merge, build, and test every code change.',
    detail: 'Every time a developer pushes code, CI automatically runs: builds the app, executes tests, and reports results within minutes. The goal is to catch integration problems early — before they become expensive production bugs. CI enforces a "never commit broken code" culture.',
    keyPoints: ['Every push triggers an automated build + test run', 'PRs cannot merge until all CI checks pass', 'Tests run in clean, isolated environments', 'Results reported in the PR within minutes'],
  },
  {
    title: 'CD — Continuous Delivery', icon: '📦', color: '#a855f7',
    short: 'Automatically prepare releases so they can be deployed anytime.',
    detail: 'CD ensures the codebase is always in a deployable state. Every successful CI run produces a release artifact (Docker image, ZIP, etc.) that is ready to deploy. Delivery does not mean automatic deployment to production — it means you COULD deploy at any moment with one click.',
    keyPoints: ['Build artifacts are versioned and stored after every green CI run', 'Staging environment always has the latest passing build', 'Deployment is a business decision, not a technical one', 'Rollback is fast because artifacts are preserved'],
  },
  {
    title: 'CD — Continuous Deployment', icon: '🚀', color: '#ec4899',
    short: 'Automatically deploy every passing build to production.',
    detail: 'A step beyond Delivery — every green build goes to production automatically with NO manual gate. Used by high-velocity teams (Netflix, Amazon) who deploy hundreds of times per day. Requires extremely high test confidence (>95% coverage, mutation testing, canary deploys).',
    keyPoints: ['No human approval needed — fully automated production deployments', 'Requires excellent test coverage and monitoring', 'Canary/blue-green deployments reduce blast radius', 'Feature flags control feature visibility independently from deployment'],
  },
  {
    title: 'GitHub Actions', icon: '⚡', color: '#10b981',
    short: 'GitHub\'s built-in CI/CD platform — YAML workflows, free for public repos.',
    detail: 'GitHub Actions lets you automate workflows directly in your repository. Workflows are YAML files in .github/workflows/ that define triggers (on: push, pull_request, schedule) and jobs (sequences of steps). Runners are virtual machines that execute the steps — ubuntu-latest is the most common.',
    keyPoints: ['Free for public repos; 2,000 minutes/month for private', 'Matrix builds run the same job across multiple OS/Node versions', 'Marketplace has 10,000+ pre-built Actions to reuse', 'Artifacts store test reports, screenshots, binaries'],
  },
  {
    title: 'Environment Variables & Secrets', icon: '🔐', color: '#f59e0b',
    short: 'Never hardcode credentials — use GitHub Secrets.',
    detail: 'GitHub Secrets are encrypted values stored at repo, organization, or environment level. They are injected as environment variables during workflow runs. Jobs targeting production environments can require manual approval before accessing production secrets.',
    keyPoints: ['Set secrets in: Settings → Secrets → Actions', 'Access via ${{ secrets.MY_SECRET }} in YAML', 'Environment secrets require approval gate', 'Never print secrets with echo or console.log'],
  },
  {
    title: 'Branch Protection Rules', icon: '🛡️', color: '#ef4444',
    short: 'Force CI to pass before any code can merge to main.',
    detail: 'Branch protection rules on main/develop enforce quality gates. Required status checks must pass, a minimum number of approvals needed, and force-push can be blocked. This turns CI from optional to mandatory — developers cannot skip tests.',
    keyPoints: ['Settings → Branches → Add rule → Require status checks', 'Select specific CI jobs that must pass', 'Require PR reviews (1 or 2 reviewers)', 'Prevent force-push and branch deletion'],
  },
];

const tips = [
  { icon: '⚡', tip: 'Cache node_modules with actions/cache or use setup-node\'s built-in cache: "npm" — saves 30–60 seconds per run.' },
  { icon: '🔀', tip: 'Use matrix strategy to run the same tests across multiple Node versions or browsers in parallel — not sequentially.' },
  { icon: '🧪', tip: 'Set retries: 2 in Playwright for CI. Flaky tests should be fixed, but retries prevent false failures from transient issues.' },
  { icon: '📊', tip: 'Upload test reports as artifacts with actions/upload-artifact — expires after 30 days but keeps history for investigation.' },
  { icon: '🔐', tip: 'Never use secrets in environment names or step names — GitHub may log them. Always mask sensitive values.' },
  { icon: '🚫', tip: 'Set fail-fast: false in matrix jobs so all shards run even if one fails — you get the full picture of what broke.' },
  { icon: '⏰', tip: 'Add timeout-minutes: 30 to jobs to prevent hung tests from blocking runners and wasting CI minutes.' },
  { icon: '🌿', tip: 'Use on: workflow_dispatch to allow manual triggers — useful for performance tests you don\'t want on every commit.' },
];

/* ─── Component ─────────────────────────────────────────── */

export default function CICDPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('concepts');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', height: '100%' }}>

        {/* ── Sidebar nav ── */}
        <div style={{
          width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 0', overflowY: 'auto',
        }}>
          <div style={{ padding: '0 16px 12px', fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
            Topics
          </div>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 16px',
                background: activeSection === s.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: `1px solid ${activeSection === s.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                borderLeft: `3px solid ${activeSection === s.id ? '#6366f1' : 'transparent'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ fontSize: 12, color: activeSection === s.id ? '#a5b4fc' : '#64748b', fontWeight: activeSection === s.id ? 600 : 400 }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>

          {/* ═══ CORE CONCEPTS ═══ */}
          {activeSection === 'concepts' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🧠 CI/CD Core Concepts</h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                  Understanding the difference between CI, Continuous Delivery, and Continuous Deployment — and why it matters for QA.
                </p>
              </div>

              {/* CI/CD pipeline visual */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 14 }}>The Pipeline at a Glance</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
                  {[
                    { label: 'Code Push', icon: '💾', color: '#6366f1' },
                    { label: 'Build', icon: '🔨', color: '#8b5cf6' },
                    { label: 'Test', icon: '🧪', color: '#a855f7' },
                    { label: 'Staging', icon: '📦', color: '#ec4899' },
                    { label: 'Approve', icon: '✅', color: '#f59e0b' },
                    { label: 'Production', icon: '🚀', color: '#10b981' },
                  ].map((step, i, arr) => (
                    <div key={step.label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center', minWidth: 80 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12, margin: '0 auto 6px',
                          background: `${step.color}20`, border: `1px solid ${step.color}50`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                        }}>{step.icon}</div>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap' }}>{step.label}</div>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, rgba(99,102,241,0.5), rgba(99,102,241,0.1))', flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(99,102,241,0.07)', borderRadius: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                  <span style={{ color: '#a5b4fc', fontWeight: 600 }}>CI </span> = Code Push → Build → Test&nbsp;&nbsp;
                  <span style={{ color: '#ec4899', fontWeight: 600 }}>Continuous Delivery </span> = + Staging&nbsp;&nbsp;
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Continuous Deployment </span> = Auto to Production (no manual gate)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {concepts.map(c => (
                  <div key={c.title} style={{
                    background: '#12121a', border: `1px solid ${expandedConcept === c.title ? c.color + '40' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 14, overflow: 'hidden', transition: 'all 0.18s',
                  }}>
                    <div
                      onClick={() => setExpandedConcept(expandedConcept === c.title ? null : c.title)}
                      style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${c.color}18`, border: `1px solid ${c.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: c.color, marginBottom: 3 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{c.short}</div>
                      </div>
                      <span style={{ color: '#475569', fontSize: 13 }}>{expandedConcept === c.title ? '▲' : '▼'}</span>
                    </div>
                    {expandedConcept === c.title && (
                      <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, margin: '14px 0 12px' }}>{c.detail}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {c.keyPoints.map((p, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <span style={{ color: c.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>→</span>
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ GITHUB ACTIONS ═══ */}
          {activeSection === 'github-actions' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>⚡ GitHub Actions</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Everything you need to write production-grade GitHub Actions workflows from scratch.
              </p>

              {/* Anatomy card */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 14 }}>📐 Anatomy of a Workflow File</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {[
                    { term: 'on:', desc: 'Trigger — when to run: push, pull_request, schedule, workflow_dispatch', color: '#6366f1' },
                    { term: 'jobs:', desc: 'A workflow has one or more jobs. Jobs run in parallel by default.', color: '#a855f7' },
                    { term: 'runs-on:', desc: 'The runner OS: ubuntu-latest, windows-latest, macos-latest', color: '#ec4899' },
                    { term: 'steps:', desc: 'Ordered list of commands or pre-built Actions within a job.', color: '#10b981' },
                    { term: 'uses:', desc: 'Reference a pre-built Action from Marketplace (e.g. actions/checkout@v4)', color: '#f59e0b' },
                    { term: 'run:', desc: 'Execute a shell command directly on the runner.', color: '#ef4444' },
                    { term: 'env:', desc: 'Set environment variables for a step, job, or entire workflow.', color: '#8b5cf6' },
                    { term: 'needs:', desc: 'Make a job wait for another job to succeed first.', color: '#14b8a6' },
                  ].map(item => (
                    <div key={item.term} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${item.color}25`, borderRadius: 8, padding: '10px 12px' }}>
                      <code style={{ color: item.color, fontSize: 13, fontWeight: 700 }}>{item.term}</code>
                      <p style={{ margin: '5px 0 0', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <CodeBlock title="Your First Workflow — Basic CI" codeKey="basic_workflow" code={codeBlocks.basic_workflow} copiedKey={copiedKey} onCopy={copyCode} />

              <div style={{ marginBottom: 20, padding: '16px 20px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', marginBottom: 10 }}>📁 File location matters</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                  Save your workflow as <code style={{ color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '1px 6px', borderRadius: 4 }}>.github/workflows/ci.yml</code> in your repo root. GitHub automatically detects any <code>.yml</code> file in that directory and runs it based on the triggers you define.
                </div>
              </div>

              <CodeBlock title="Using Secrets in Workflows" codeKey="secrets_example" code={codeBlocks.secrets_example} copiedKey={copiedKey} onCopy={copyCode} />
            </div>
          )}

          {/* ═══ PLAYWRIGHT IN CI ═══ */}
          {activeSection === 'playwright-ci' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🎭 Playwright in CI/CD</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Run Playwright E2E tests on every PR with parallel sharding, browser matrix, and auto-uploaded reports.
              </p>

              <StepGuide steps={[
                { n: 1, title: 'Install Playwright in your project', code: 'npm init playwright@latest\n# or\nnpm install --save-dev @playwright/test\nnpx playwright install --with-deps' },
                { n: 2, title: 'Configure for CI in playwright.config.ts', desc: 'Set retries, forbid .only, and enable CI-specific reporters' },
                { n: 3, title: 'Create .github/workflows/e2e.yml', desc: 'Use matrix sharding to run tests in parallel across multiple workers' },
                { n: 4, title: 'Push to GitHub and watch CI run', desc: 'CI installs browsers, starts your app, runs tests, and uploads reports as artifacts' },
                { n: 5, title: 'Download report from Actions → Artifacts', desc: 'HTML report shows pass/fail/flaky, screenshots on failure, and trace viewer' },
              ]} />

              <CodeBlock title="playwright.config.ts — CI-optimised config" codeKey="playwright_config" code={codeBlocks.playwright_config} copiedKey={copiedKey} onCopy={copyCode} />
              <CodeBlock title="GitHub Actions — Playwright with Sharding" codeKey="playwright_workflow" code={codeBlocks.playwright_workflow} copiedKey={copiedKey} onCopy={copyCode} />

              <NoteBox color="#10b981" title="💡 Pro tip — Parallel sharding">
                With 400 tests taking 20 minutes on 1 runner, 4 shards reduce that to ~5 minutes. The merge-reports job stitches all shard results into one HTML report. Each shard runs independently — fail-fast: false ensures all shards complete so you see the full picture.
              </NoteBox>
            </div>
          )}

          {/* ═══ API TESTS IN CI ═══ */}
          {activeSection === 'api-ci' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🔌 API Tests in CI/CD</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Run Postman/Newman collections, pytest, or custom API tests with a real database in GitHub Actions.
              </p>

              <StepGuide steps={[
                { n: 1, title: 'Export your Postman collection', desc: 'File → Export → Collection v2.1. Also export your environment JSON.' },
                { n: 2, title: 'Commit both files to your repo', code: 'git add tests/api/collection.json tests/api/env.staging.json\ngit commit -m "ci: add API test collection"' },
                { n: 3, title: 'Use GitHub Actions services to spin up a real database', desc: 'The services: block creates a Docker container alongside your job — no manual setup needed.' },
                { n: 4, title: 'Install Newman and run the collection', code: 'npm install -g newman newman-reporter-htmlextra\nnewman run collection.json -e env.json --bail' },
                { n: 5, title: 'Upload the HTML report as an artifact', desc: 'Find it under Actions → Run → Artifacts after the workflow completes.' },
              ]} />

              <CodeBlock title="API Tests with PostgreSQL service" codeKey="api_test_workflow" code={codeBlocks.api_test_workflow} copiedKey={copiedKey} onCopy={copyCode} />

              <NoteBox color="#6366f1" title="📝 Test isolation tip">
                Each CI run should start with a clean database. Use seed scripts in your test setup to create known data, and reset state between test suites. Never run API tests against production data.
              </NoteBox>
            </div>
          )}

          {/* ═══ PERFORMANCE IN CI ═══ */}
          {activeSection === 'performance-ci' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>📊 Performance Tests in CI/CD</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Run k6 load tests in CI to catch performance regressions before they reach production.
              </p>

              <StepGuide steps={[
                { n: 1, title: 'Write your k6 test script', desc: 'Define VU ramp stages and performance thresholds (P95 < 500ms, error rate < 1%).' },
                { n: 2, title: 'Run smoke test on every PR', desc: 'Light load (5 VUs, 30 seconds) — just enough to catch obvious regressions fast.' },
                { n: 3, title: 'Run full load test on merge to main only', desc: 'Use if: github.ref == refs/heads/main to gate heavy tests.' },
                { n: 4, title: 'Use thresholds to fail CI automatically', desc: 'k6 returns exit code 1 if any threshold is breached — CI fails automatically.' },
                { n: 5, title: 'Store results in Grafana Cloud or InfluxDB', desc: 'Stream results with -o influxdb=http://... or k6 cloud for trend analysis over time.' },
              ]} />

              <CodeBlock title="k6 load test script" codeKey="k6_script" code={codeBlocks.k6_script} copiedKey={copiedKey} onCopy={copyCode} />
              <CodeBlock title="GitHub Actions — k6 workflow" codeKey="k6_workflow" code={codeBlocks.k6_workflow} copiedKey={copiedKey} onCopy={copyCode} />

              <NoteBox color="#f59e0b" title="⚠️ Never run load tests against production">
                Always target staging or a dedicated load-test environment. A badly configured test against production can take down your service for real customers. Use separate BASE_URL secrets for each environment.
              </NoteBox>
            </div>
          )}

          {/* ═══ PIPELINE STAGES ═══ */}
          {activeSection === 'pipeline-stages' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🚀 Pipeline Stages Deep Dive</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                A complete production QA pipeline has 8 stages. Click each stage to understand what it does and how to implement it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pipelineStages.map(stage => (
                  <div key={stage.stage} style={{
                    background: '#12121a',
                    border: `1px solid ${activeStage === stage.stage ? stage.color + '45' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 14, overflow: 'hidden', transition: 'all 0.18s',
                  }}>
                    <div
                      onClick={() => setActiveStage(activeStage === stage.stage ? null : stage.stage)}
                      style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `${stage.color}18`, border: `1px solid ${stage.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      }}>{stage.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                          <span style={{ fontSize: 11, color: stage.color, fontWeight: 700 }}>STAGE {stage.stage}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{stage.name}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{stage.desc}</div>
                      </div>
                      <div style={{ fontSize: 10, color: '#475569', textAlign: 'right', flexShrink: 0 }}>
                        <div>{stage.trigger}</div>
                      </div>
                      <span style={{ color: '#475569', fontSize: 12, flexShrink: 0 }}>{activeStage === stage.stage ? '▲' : '▼'}</span>
                    </div>
                    {activeStage === stage.stage && (
                      <div style={{ padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {stage.actions.map((action, i) => (
                            <span key={i} style={{
                              padding: '4px 10px', borderRadius: 20, fontSize: 11,
                              background: `${stage.color}12`, color: stage.color,
                              border: `1px solid ${stage.color}25`, fontFamily: 'monospace',
                            }}>{action}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24 }}>
                <CodeBlock title="Complete Full QA Pipeline YAML" codeKey="full_qa_pipeline" code={codeBlocks.full_qa_pipeline} copiedKey={copiedKey} onCopy={copyCode} />
              </div>
            </div>
          )}

          {/* ═══ BEST PRACTICES ═══ */}
          {activeSection === 'best-practices' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>✅ CI/CD Best Practices</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                The patterns that separate amateur pipelines from production-grade CI/CD at top tech companies.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 28 }}>
                {tips.map((t, i) => (
                  <div key={i} style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{t.icon}</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>{t.tip}</p>
                  </div>
                ))}
              </div>

              {/* Branch protection guide */}
              <div style={{ background: '#12121a', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#a5b4fc', marginBottom: 14 }}>🛡️ How to Set Up Branch Protection Rules</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Go to your GitHub repository → Settings → Branches',
                    'Click "Add branch protection rule"',
                    'Set "Branch name pattern" to: main',
                    'Check: "Require a pull request before merging"',
                    'Check: "Require status checks to pass before merging"',
                    'In the search box, select the CI jobs that must pass (e.g. "test", "lint")',
                    'Optionally: require 1 or 2 PR approvals',
                    'Check: "Do not allow bypassing the above settings"',
                    'Click "Create" — now CI is mandatory for all merges',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '7px 0', borderBottom: i < 8 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span style={{ color: '#6366f1', fontWeight: 800, fontSize: 12, flexShrink: 0, width: 20 }}>{i + 1}.</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ REAL EXAMPLES ═══ */}
          {activeSection === 'real-examples' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>💼 Real-World CI/CD Examples</h1>
              <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Production patterns from real engineering teams — ready to copy and adapt.
              </p>

              <CodeBlock title="Run Tests in Docker Container" codeKey="docker_workflow" code={codeBlocks.docker_workflow} copiedKey={copiedKey} onCopy={copyCode} />

              {/* Interview questions */}
              <div style={{ background: '#12121a', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24', marginBottom: 14 }}>💼 Interview Questions on CI/CD</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    {
                      q: 'What is the difference between Continuous Delivery and Continuous Deployment?',
                      a: 'Continuous Delivery means every green build can be deployed at any time — a human decides when. Continuous Deployment means every green build IS automatically deployed to production with no human gate. Delivery is safer for regulated industries; Deployment is used by high-velocity teams like Netflix and Amazon.',
                    },
                    {
                      q: 'How do you handle flaky tests in a CI pipeline?',
                      a: 'First, quarantine flaky tests in a separate suite that doesn\'t block CI. Then fix them — most flaky tests have root causes: timing issues, shared state, or environment dependencies. Use retries: 2 in Playwright for transient infrastructure issues only, not test logic failures.',
                    },
                    {
                      q: 'How would you speed up a CI pipeline that takes 45 minutes?',
                      a: 'Cache node_modules/npm cache. Parallelize with matrix and job splitting. Shard E2E tests across 4+ workers. Move performance/security tests to a separate nightly pipeline. Run unit tests first (fast feedback) and only proceed to slow tests if they pass.',
                    },
                    {
                      q: 'What happens when CI fails in a shared branch?',
                      a: 'With branch protection rules on main, CI failures block all PRs from merging. The developer who broke CI is responsible for fixing it immediately — this is non-negotiable on professional teams. Never bypass the check with --no-verify or force-pushing.',
                    },
                  ].map(({ q, a }) => (
                    <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>Q: {q}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>A: {a}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick reference table */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 14 }}>⚡ Common GitHub Actions Commands — Quick Reference</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { cmd: 'actions/checkout@v4', desc: 'Check out your repository code' },
                    { cmd: 'actions/setup-node@v4', desc: 'Install Node.js with npm cache' },
                    { cmd: 'actions/upload-artifact@v4', desc: 'Save files (reports, screenshots)' },
                    { cmd: 'actions/download-artifact@v4', desc: 'Retrieve saved files in another job' },
                    { cmd: 'actions/cache@v4', desc: 'Cache directories between runs' },
                    { cmd: 'codecov/codecov-action@v4', desc: 'Upload coverage to Codecov' },
                    { cmd: 'if: always()', desc: 'Run step even if previous step failed' },
                    { cmd: 'if: failure()', desc: 'Run step only when something failed' },
                    { cmd: 'needs: [job1, job2]', desc: 'Wait for multiple jobs before starting' },
                    { cmd: 'timeout-minutes: 30', desc: 'Kill hung job after 30 minutes' },
                    { cmd: 'continue-on-error: true', desc: 'Don\'t fail workflow if this step fails' },
                    { cmd: 'environment: production', desc: 'Require manual approval gate' },
                  ].map(({ cmd, desc }) => (
                    <div key={cmd} style={{ display: 'flex', gap: 10, padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 7 }}>
                      <code style={{ fontSize: 11, color: '#6366f1', flexShrink: 0, fontFamily: 'monospace' }}>{cmd}</code>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* ─── Sub-components ────────────────────────────────────── */

function CodeBlock({ title, codeKey, code, copiedKey, onCopy }: {
  title: string; codeKey: string; code: string;
  copiedKey: string | null; onCopy: (key: string, code: string) => void;
}) {
  return (
    <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
      <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{title}</span>
        <button
          onClick={() => onCopy(codeKey, code)}
          style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600,
            background: copiedKey === codeKey ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)',
            border: `1px solid ${copiedKey === codeKey ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.25)'}`,
            color: copiedKey === codeKey ? '#10b981' : '#a5b4fc',
            transition: 'all 0.2s',
          }}
        >{copiedKey === codeKey ? '✓ Copied!' : '📋 Copy'}</button>
      </div>
      <pre style={{
        margin: 0, padding: '16px 18px', overflow: 'auto',
        fontSize: 12, lineHeight: 1.7, color: '#a5b4fc', fontFamily: '"Fira Code", "Consolas", monospace',
        whiteSpace: 'pre',
      }}>{code}</pre>
    </div>
  );
}

function StepGuide({ steps }: { steps: { n: number; title: string; desc?: string; code?: string }[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {steps.map((step, i) => (
        <div key={step.n} style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff',
          }}>{step.n}</div>
          <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 14 : 0, borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: step.desc || step.code ? 6 : 0 }}>{step.title}</div>
            {step.desc && <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>}
            {step.code && <pre style={{ margin: '6px 0 0', padding: '8px 12px', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, fontSize: 11, color: '#a5b4fc', fontFamily: 'monospace', overflowX: 'auto' }}>{step.code}</pre>}
          </div>
        </div>
      ))}
    </div>
  );
}

function NoteBox({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '14px 18px', background: `${color}09`, border: `1px solid ${color}30`, borderRadius: 12, marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
