'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

type Tab = 'overview' | 'playwright' | 'selenium' | 'cypress' | 'k6' | 'postman' | 'appium' | 'jest' | 'how-it-works';

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'overview', icon: '🗺️', label: 'Overview' },
  { id: 'playwright', icon: '🎭', label: 'Playwright' },
  { id: 'cypress', icon: '🌲', label: 'Cypress' },
  { id: 'selenium', icon: '🤖', label: 'Selenium' },
  { id: 'jest', icon: '🃏', label: 'Jest / Vitest' },
  { id: 'postman', icon: '📮', label: 'Postman / Newman' },
  { id: 'k6', icon: '📊', label: 'k6 Load Testing' },
  { id: 'appium', icon: '📱', label: 'Appium (Mobile)' },
  { id: 'how-it-works', icon: '⚙️', label: 'How It Works' },
];

const tools = [
  { name: 'Playwright', icon: '🎭', color: '#45ba4b', vendor: 'Microsoft', type: 'E2E / Browser', lang: 'JS/TS, Python, C#, Java', best: 'Cross-browser E2E, API testing, component testing', badge: 'Recommended' },
  { name: 'Cypress', icon: '🌲', color: '#17202c', textColor: '#69d3a7', vendor: 'Cypress.io', type: 'E2E / Component', lang: 'JavaScript/TypeScript', best: 'Fast feedback, component tests, real-time reloading', badge: 'Most Developer-Friendly' },
  { name: 'Selenium', icon: '🤖', color: '#43b02a', vendor: 'Selenium HQ', type: 'Browser automation', lang: 'Java, Python, C#, JS, Ruby', best: 'Legacy apps, Java teams, maximum browser/OS coverage', badge: 'Industry Standard' },
  { name: 'Jest / Vitest', icon: '🃏', color: '#c21325', vendor: 'Meta / Vitest team', type: 'Unit / Integration', lang: 'JavaScript/TypeScript', best: 'Unit tests, React component tests, coverage reports', badge: 'Best for Unit Tests' },
  { name: 'Postman / Newman', icon: '📮', color: '#ff6c37', vendor: 'Postman', type: 'API Testing', lang: 'No-code + CLI', best: 'API exploration, contract tests, CI automation', badge: 'Best for API' },
  { name: 'k6', icon: '📊', color: '#7d64ff', vendor: 'Grafana Labs', type: 'Performance / Load', lang: 'JavaScript', best: 'Load tests, spike tests, performance thresholds in CI', badge: 'Best for Load Tests' },
  { name: 'Appium', icon: '📱', color: '#662d8c', vendor: 'Appium / JS Foundation', type: 'Mobile automation', lang: 'Any (WebDriver protocol)', best: 'iOS + Android native apps, cross-platform mobile testing', badge: 'Mobile Standard' },
];

interface InstallStep { heading: string; code?: string; note?: string; }
interface Section { title: string; steps: InstallStep[]; }

const guides: Record<Tab, Section[]> = {
  overview: [], 'how-it-works': [],

  playwright: [
    {
      title: '1. Prerequisites — Node.js 18+',
      steps: [
        { heading: 'Download from nodejs.org or use a version manager:', code: '# Windows (via winget)\nwinget install OpenJS.NodeJS\n\n# macOS (via Homebrew)\nbrew install node\n\n# Linux (Ubuntu/Debian)\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt-get install -y nodejs\n\n# Verify\nnode --version   # should be 18+\nnpm --version' },
      ],
    },
    {
      title: '2. Create a new project & install Playwright',
      steps: [
        { heading: 'Initialize a new test project:', code: 'mkdir my-tests && cd my-tests\nnpm init -y\n\n# Install Playwright with the interactive wizard\nnpm init playwright@latest\n\n# The wizard asks:\n# ✔ Do you want to use TypeScript?  → Yes\n# ✔ Where to put your end-to-end tests? → tests\n# ✔ Add a GitHub Actions workflow?  → Yes\n# ✔ Install Playwright browsers?    → Yes' },
        { heading: 'Or add Playwright to an existing project:', code: 'npm install --save-dev @playwright/test\nnpx playwright install            # install Chrome, Firefox, WebKit\nnpx playwright install --with-deps  # also install OS-level dependencies (Linux)' },
      ],
    },
    {
      title: '3. Project structure after setup',
      steps: [
        { heading: 'What gets created:', code: 'my-tests/\n├── tests/\n│   └── example.spec.ts    ← your first test\n├── playwright.config.ts   ← configuration\n├── package.json\n└── .github/\n    └── workflows/\n        └── playwright.yml  ← CI workflow' },
      ],
    },
    {
      title: '4. Write your first test',
      steps: [
        { heading: 'tests/login.spec.ts:', code: `import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('should log in with valid credentials', async ({ page }) => {
    await page.goto('https://example.com/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should show error for wrong password', async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});` },
      ],
    },
    {
      title: '5. Run tests',
      steps: [
        { heading: 'Common Playwright commands:', code: 'npx playwright test                    # run all tests\nnpx playwright test login.spec.ts      # run one file\nnpx playwright test --headed           # show browser window\nnpx playwright test --ui               # open interactive UI mode\nnpx playwright test --debug            # pause at each step\nnpx playwright test --reporter=html    # generate HTML report\nnpx playwright show-report             # open the report\nnpx playwright codegen example.com     # record test by clicking' },
      ],
    },
    {
      title: '6. VS Code Extension',
      steps: [
        { heading: 'Install the official Playwright VS Code extension:', code: 'code --install-extension ms-playwright.playwright', note: 'The extension adds: run/debug individual tests with one click, record new tests via UI, step-through debugging with variable inspection.' },
      ],
    },
  ],

  cypress: [
    {
      title: '1. Install Cypress',
      steps: [
        { heading: 'Add to an existing project:', code: 'npm install --save-dev cypress\n\n# Or create a fresh project:\nmkdir cypress-tests && cd cypress-tests\nnpm init -y\nnpm install --save-dev cypress typescript' },
        { heading: 'Open Cypress for the first time (interactive setup):', code: 'npx cypress open\n# This launches the Cypress GUI which walks you through:\n# 1. Choose E2E Testing or Component Testing\n# 2. Configure your browser\n# 3. Creates cypress.config.ts and cypress/ folder' },
      ],
    },
    {
      title: '2. Project structure',
      steps: [
        { heading: 'Cypress creates this structure:', code: 'my-project/\n├── cypress/\n│   ├── e2e/\n│   │   └── login.cy.ts        ← your tests\n│   ├── fixtures/\n│   │   └── users.json         ← test data\n│   ├── support/\n│   │   ├── commands.ts        ← custom commands\n│   │   └── e2e.ts             ← global setup\n│   └── downloads/\n└── cypress.config.ts           ← configuration' },
      ],
    },
    {
      title: '3. Write your first Cypress test',
      steps: [
        { heading: 'cypress/e2e/login.cy.ts:', code: `describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in with valid credentials', () => {
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });

  it('shows error for invalid password', () => {
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('wrong');
    cy.get('[data-testid="submit"]').click();

    cy.get('[data-testid="error"]').should('contain', 'Invalid credentials');
  });
});` },
      ],
    },
    {
      title: '4. Run tests',
      steps: [
        { heading: 'Cypress commands:', code: 'npx cypress open              # interactive GUI (watch mode)\nnpx cypress run               # headless (CI mode)\nnpx cypress run --browser firefox\nnpx cypress run --spec "cypress/e2e/login.cy.ts"\nnpx cypress run --headed      # show browser in CI' },
      ],
    },
    {
      title: '5. cypress.config.ts — key settings',
      steps: [
        { heading: 'Common configuration:', code: `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    retries: { runMode: 2, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    setupNodeEvents(on, config) {
      // register plugins here
    },
  },
});` },
      ],
    },
  ],

  selenium: [
    {
      title: '1. Install Selenium for your language',
      steps: [
        { heading: 'JavaScript / Node.js:', code: 'npm install selenium-webdriver\nnpm install --save-dev @types/selenium-webdriver  # TypeScript types' },
        { heading: 'Python:', code: 'pip install selenium' },
        { heading: 'Java (Maven pom.xml):', code: `<dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>selenium-java</artifactId>
  <version>4.18.1</version>
</dependency>` },
        { heading: 'C# (NuGet):', code: 'dotnet add package Selenium.WebDriver\ndotnet add package Selenium.WebDriver.ChromeDriver' },
      ],
    },
    {
      title: '2. Install browser drivers (Selenium 4.6+ handles this automatically)',
      steps: [
        { heading: 'Selenium 4.6+ auto-manages ChromeDriver. For older versions:', code: '# Python — install webdriver-manager (recommended)\npip install webdriver-manager\n\n# Then in your test:\n# from selenium.webdriver.chrome.service import Service\n# from webdriver_manager.chrome import ChromeDriverManager\n# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))' },
        { heading: 'Or download ChromeDriver manually from chromedriver.chromium.org', note: 'ChromeDriver version must match your Chrome browser version exactly.' },
      ],
    },
    {
      title: '3. Write your first Selenium test (Python)',
      steps: [
        { heading: 'test_login.py:', code: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')          # run without visible window
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()  # cleanup after each test

def test_login_success(driver):
    driver.get('https://example.com/login')

    wait = WebDriverWait(driver, 10)

    email = wait.until(EC.presence_of_element_located((By.ID, 'email')))
    email.send_keys('user@example.com')

    driver.find_element(By.ID, 'password').send_keys('password123')
    driver.find_element(By.CSS_SELECTOR, 'button[type=submit]').click()

    wait.until(EC.url_contains('/dashboard'))
    assert '/dashboard' in driver.current_url` },
      ],
    },
    {
      title: '4. Run Selenium tests',
      steps: [
        { heading: 'Python:', code: 'pytest tests/ -v\npytest tests/test_login.py -v --html=report.html' },
        { heading: 'JavaScript:', code: 'node test_login.js\n# or with Mocha:\nnpm install --save-dev mocha\nnpx mocha tests/' },
        { heading: 'Java:', code: 'mvn test\n# or\ngradle test' },
      ],
    },
    {
      title: '5. Selenium Grid — run tests in parallel across browsers',
      steps: [
        { heading: 'Start Selenium Grid with Docker:', code: `# docker-compose.selenium.yml
# version: '3'
# services:
#   selenium-hub:
#     image: selenium/hub:4
#     ports: ["4444:4444"]
#   chrome:
#     image: selenium/node-chrome:4
#     depends_on: [selenium-hub]
#     environment:
#       SE_EVENT_BUS_HOST: selenium-hub
#   firefox:
#     image: selenium/node-firefox:4
#     depends_on: [selenium-hub]
#     environment:
#       SE_EVENT_BUS_HOST: selenium-hub

docker-compose -f docker-compose.selenium.yml up -d

# Then point your tests at the Grid:
# driver = webdriver.Remote(
#     command_executor='http://localhost:4444/wd/hub',
#     options=ChromeOptions()
# )` },
      ],
    },
  ],

  jest: [
    {
      title: '1. Install Jest',
      steps: [
        { heading: 'For a plain JavaScript/TypeScript project:', code: 'npm install --save-dev jest @types/jest ts-jest\n\n# Create jest.config.ts:\nnpx ts-jest config:init' },
        { heading: 'For a React project (Create React App — already included):', code: '# CRA already has Jest. Just run:\nnpm test\n\n# For Next.js:\nnpm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom' },
      ],
    },
    {
      title: '2. Install Vitest (modern Jest alternative — faster, Vite-native)',
      steps: [
        { heading: 'Install Vitest in a Vite or Next.js project:', code: 'npm install --save-dev vitest @vitest/ui @vitest/coverage-v8\n\n# Add to package.json scripts:\n# "test": "vitest",\n# "test:ui": "vitest --ui",\n# "coverage": "vitest run --coverage"' },
        { heading: 'vitest.config.ts:', code: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',   // simulate browser DOM
    globals: true,          // use describe/it/expect without imports
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: { lines: 80, functions: 80 },
    },
  },
});` },
      ],
    },
    {
      title: '3. Write unit tests',
      steps: [
        { heading: 'src/utils/formatPrice.test.ts:', code: `import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats positive numbers with dollar sign', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatPrice(9.999)).toBe('$10.00');
  });

  it('throws on negative input', () => {
    expect(() => formatPrice(-1)).toThrow('Price cannot be negative');
  });
});` },
      ],
    },
    {
      title: '4. Write React component tests (with Testing Library)',
      steps: [
        { heading: 'src/components/Button.test.tsx:', code: `import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Submit" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button label="Submit" onClick={() => {}} loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});` },
      ],
    },
    {
      title: '5. Run tests and coverage',
      steps: [
        { heading: 'Commands:', code: 'npx jest                         # run all tests\nnpx jest --watch                 # watch mode (re-run on file save)\nnpx jest --coverage              # coverage report\nnpx jest src/utils/              # run tests in a directory\nnpx jest --testNamePattern login # run tests matching a name\n\n# Vitest equivalents:\nnpx vitest                       # watch mode by default\nnpx vitest run                   # run once (CI mode)\nnpx vitest --ui                  # browser-based UI' },
      ],
    },
  ],

  postman: [
    {
      title: '1. Install Postman desktop app',
      steps: [
        { heading: 'Download from postman.com — available for Windows, macOS, Linux.', note: 'Free personal account. Team plans from $14/user/month.' },
        { heading: 'Or use the web version at web.postman.co (no install needed).' },
      ],
    },
    {
      title: '2. Install Newman (Postman CLI for CI/CD)',
      steps: [
        { heading: 'Install globally:', code: 'npm install -g newman\nnewman --version' },
        { heading: 'Install HTML report generator:', code: 'npm install -g newman-reporter-htmlextra' },
      ],
    },
    {
      title: '3. Create and run your first collection',
      steps: [
        { heading: 'In Postman desktop: New → Collection → Add Request', note: 'Group related requests into a Collection (e.g. "User API"). Add pre-request scripts and tests using the Tests tab.' },
        { heading: 'Example test script in the Tests tab (JavaScript):', code: `// In Postman Tests tab for a POST /users request:
pm.test('Status is 201 Created', () => {
  pm.response.to.have.status(201);
});

pm.test('Response has user ID', () => {
  const json = pm.response.json();
  pm.expect(json.id).to.be.a('string');
  pm.expect(json.email).to.equal(pm.variables.get('email'));
});

pm.test('Response time under 500ms', () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});

// Save the ID for use in the next request
pm.collectionVariables.set('userId', pm.response.json().id);` },
      ],
    },
    {
      title: '4. Run collection with Newman (CLI)',
      steps: [
        { heading: 'Export collection from Postman: ⋯ → Export → Collection v2.1', },
        { heading: 'Run with Newman:', code: `# Basic run
newman run collection.json

# With environment file
newman run collection.json -e environment.json

# With HTML report
newman run collection.json \\
  -e environment.json \\
  --reporters cli,htmlextra \\
  --reporter-htmlextra-export ./report.html \\
  --bail   # stop on first failure` },
      ],
    },
    {
      title: '5. Environment variables in Postman',
      steps: [
        { heading: 'Use variables instead of hardcoding URLs and tokens:', code: `// In environment file (JSON):
{
  "name": "Staging",
  "values": [
    { "key": "baseUrl", "value": "https://api.staging.example.com" },
    { "key": "token", "value": "Bearer eyJhbGci..." }
  ]
}

// In your request URL:  {{baseUrl}}/users
// In headers:           Authorization: {{token}}

// In Newman CLI:
// newman run collection.json -e staging.env.json` },
      ],
    },
  ],

  k6: [
    {
      title: '1. Install k6',
      steps: [
        { heading: 'Windows (via winget):', code: 'winget install k6 --source winget' },
        { heading: 'macOS (via Homebrew):', code: 'brew install k6' },
        { heading: 'Linux (Ubuntu/Debian):', code: `sudo gpg -k
sudo gpg --no-default-keyring \\
  --keyring /usr/share/keyrings/k6-archive-keyring.gpg \\
  --keyserver hkp://keyserver.ubuntu.com:80 \\
  --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6` },
        { heading: 'Docker (no install needed):', code: 'docker run --rm -i grafana/k6 run - <script.js' },
        { heading: 'Verify:', code: 'k6 version' },
      ],
    },
    {
      title: '2. Write a load test script',
      steps: [
        { heading: 'tests/load/smoke.js — quick sanity check (5 users, 1 minute):', code: `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,          // 5 virtual users
  duration: '30s', // run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // error rate under 1%
  },
};

export default function () {
  const res = http.get('https://httpbin.org/get');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 1000,
  });

  sleep(1); // 1 second think time between requests
}` },
        { heading: 'tests/load/load.js — full load test with ramp-up stages:', code: `import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const loginDuration = new Trend('login_duration');
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // ramp up to 50 users
    { duration: '5m', target: 50 },   // hold at 50
    { duration: '2m', target: 200 },  // spike to 200
    { duration: '5m', target: 200 },  // hold spike
    { duration: '2m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    http_req_failed: ['rate<0.01'],
    login_duration: ['avg<300'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Login request
  const loginRes = http.post(\`\${BASE_URL}/api/login\`, JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }), { headers: { 'Content-Type': 'application/json' } });

  const ok = check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login has token': (r) => r.json('token') !== undefined,
  });

  loginDuration.add(loginRes.timings.duration);
  errorRate.add(!ok);

  sleep(1);
}` },
      ],
    },
    {
      title: '3. Run k6 tests',
      steps: [
        { heading: 'Common k6 commands:', code: `k6 run smoke.js                         # basic run
k6 run load.js                          # full load test
k6 run --vus 10 --duration 30s smoke.js # override VUs/duration
k6 run -e BASE_URL=https://staging.example.com load.js  # env var
k6 run --out json=results.json load.js  # save results to JSON
k6 run --out influxdb=http://localhost:8086/k6 load.js  # stream to InfluxDB` },
      ],
    },
    {
      title: '4. View results in Grafana (optional but powerful)',
      steps: [
        { heading: 'Start InfluxDB + Grafana with Docker Compose:', code: `# docker-compose.k6.yml
# services:
#   influxdb:
#     image: influxdb:1.8
#     ports: ["8086:8086"]
#   grafana:
#     image: grafana/grafana
#     ports: ["3001:3000"]
#     environment:
#       GF_AUTH_ANONYMOUS_ENABLED: "true"

docker-compose -f docker-compose.k6.yml up -d

# Run k6 streaming to InfluxDB:
k6 run --out influxdb=http://localhost:8086/k6 load.js

# Open Grafana at http://localhost:3001
# Import the k6 dashboard (ID: 2587 from grafana.com/dashboards)` },
      ],
    },
  ],

  appium: [
    {
      title: '1. Install Prerequisites',
      steps: [
        { heading: 'Install Node.js 18+ (required for Appium server)', code: 'node --version  # must be 18+' },
        { heading: 'Install Java JDK 11+ (required for Android):', code: '# Windows: download from adoptium.net\n# macOS:\nbrew install --cask temurin\n\n# Verify:\njava --version\n\n# Set JAVA_HOME environment variable:\n# Windows: System Properties → Environment Variables → JAVA_HOME = C:\\Program Files\\Java\\jdk-17\n# macOS/Linux: export JAVA_HOME=$(/usr/libexec/java_home)' },
        { heading: 'Android: Install Android Studio and set ANDROID_HOME:', code: '# Download Android Studio from developer.android.com\n# In Android Studio: SDK Manager → install:\n#   - Android SDK Platform (API 33+)\n#   - Android SDK Build-Tools\n#   - Android Emulator\n\n# Set environment variables:\n# ANDROID_HOME = C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk  (Windows)\n# ANDROID_HOME = ~/Library/Android/sdk  (macOS)\n\nexport PATH=$PATH:$ANDROID_HOME/emulator\nexport PATH=$PATH:$ANDROID_HOME/platform-tools' },
        { heading: 'iOS: Install Xcode (macOS only):', code: '# Install Xcode from the Mac App Store\nxcode-select --install\n\n# Install Xcode Command Line Tools:\nsudo xcodebuild -license accept\n\n# Install Carthage (dependency manager for WebDriverAgent):\nbrew install carthage' },
      ],
    },
    {
      title: '2. Install Appium server and drivers',
      steps: [
        { heading: 'Install Appium globally:', code: 'npm install -g appium\nappium --version' },
        { heading: 'Install platform drivers:', code: '# Android driver:\nappium driver install uiautomator2\n\n# iOS driver (macOS only):\nappium driver install xcuitest\n\n# List installed drivers:\nappium driver list' },
        { heading: 'Verify environment with appium-doctor:', code: 'npm install -g @appium/doctor\nappium-doctor --android    # check Android setup\nappium-doctor --ios        # check iOS setup (macOS only)' },
      ],
    },
    {
      title: '3. Install WebdriverIO (recommended JS client)',
      steps: [
        { heading: 'Set up WebdriverIO with Appium:', code: 'mkdir mobile-tests && cd mobile-tests\nnpm init wdio@latest .\n\n# The wizard will ask:\n# ✔ What type of testing? → Mobile\n# ✔ Mobile environment? → Android / iOS\n# ✔ Automation backend? → Appium\n# ✔ Framework? → Mocha / Jasmine' },
      ],
    },
    {
      title: '4. Write your first mobile test',
      steps: [
        { heading: 'tests/android.test.js:', code: `describe('Login flow', () => {
  it('should log in with valid credentials', async () => {
    const emailInput = await $('~email-input');  // accessibility ID
    await emailInput.setValue('user@example.com');

    const passwordInput = await $('~password-input');
    await passwordInput.setValue('password123');

    const loginButton = await $('~login-button');
    await loginButton.click();

    const welcomeText = await $('~welcome-message');
    await expect(welcomeText).toBeDisplayed();
    await expect(welcomeText).toHaveText('Welcome back');
  });
});` },
        { heading: 'Appium capabilities (wdio.conf.ts):', code: `// capabilities for Android emulator:
capabilities: [{
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554',
  'appium:platformVersion': '13',
  'appium:automationName': 'UiAutomator2',
  'appium:app': '/path/to/your/app.apk',
  'appium:appPackage': 'com.example.myapp',
  'appium:appActivity': 'com.example.myapp.MainActivity',
  'appium:noReset': true,
}]` },
      ],
    },
    {
      title: '5. Start Appium server and run tests',
      steps: [
        { heading: 'Start Appium server (in a separate terminal):', code: 'appium\n# Appium starts on http://localhost:4723' },
        { heading: 'Start an Android emulator (in another terminal):', code: '# List available emulators:\nemulator -list-avds\n\n# Start one:\nemulator -avd Pixel_7_API_33' },
        { heading: 'Run your tests:', code: 'npx wdio run wdio.conf.ts' },
      ],
    },
  ],
};

const howItWorks = [
  {
    tool: 'Playwright', icon: '🎭', color: '#45ba4b',
    headline: 'Directly controls browsers via the Chrome DevTools Protocol (CDP)',
    mechanism: [
      'Your test code calls Playwright\'s Node.js API (e.g. page.click())',
      'Playwright translates these calls to Chrome DevTools Protocol (CDP) messages for Chromium, a custom protocol for Firefox, and WebKit\'s internal API',
      'The browser executes the action and sends events back (DOM changes, network requests, console logs)',
      'Playwright waits for the page to reach a stable state before returning — no manual sleep() needed',
      'Built-in auto-retry: if an assertion fails (e.g. expect text not visible yet), Playwright retries until the timeout (default 30 seconds)',
    ],
    diagram: ['Test Code (TypeScript)', '→ Playwright Node.js API', '→ CDP / Browser Protocol', '→ Chromium / Firefox / WebKit', '→ DOM + Network Events', '→ Assertions'],
  },
  {
    tool: 'Cypress', icon: '🌲', color: '#69d3a7',
    headline: 'Runs inside the browser in the same event loop as your application',
    mechanism: [
      'Cypress runs your test code inside the browser itself — not in a separate process like Playwright or Selenium',
      'Tests and app share the same JavaScript runtime, giving direct access to window, document, and application state',
      'Uses a proxy server to intercept all network requests — cy.intercept() can mock or observe any HTTP call',
      'Commands are queued and executed asynchronously — cy.get() does not fail immediately; it retries until the element appears',
      'Cypress records a video and screenshots of every test run automatically',
    ],
    diagram: ['Test Code', '→ Cypress Command Queue', '→ Browser (same JS context as app)', '→ cy.intercept() proxy for network', '→ DOM assertions'],
  },
  {
    tool: 'Selenium', icon: '🤖', color: '#43b02a',
    headline: 'Sends HTTP commands to a WebDriver server which controls the browser',
    mechanism: [
      'Your test code sends HTTP requests to the WebDriver server (ChromeDriver, GeckoDriver, etc.) using the W3C WebDriver protocol',
      'ChromeDriver translates WebDriver commands into Chrome DevTools Protocol (CDP) calls to control the browser',
      'This multi-hop architecture (test → WebDriver server → browser) means Selenium is slower than Playwright or Cypress',
      'Selenium WebDriver supports every browser and every programming language — maximum compatibility',
      'Selenium Grid distributes tests across multiple browsers/OS combinations in parallel',
    ],
    diagram: ['Test Code (Java/Python/etc.)', '→ HTTP WebDriver protocol', '→ ChromeDriver / GeckoDriver', '→ Chrome / Firefox / Safari / Edge', '→ DOM actions & events'],
  },
  {
    tool: 'k6', icon: '📊', color: '#7d64ff',
    headline: 'Runs virtual users (VUs) as lightweight goroutines, not real browsers',
    mechanism: [
      'Each "Virtual User" in k6 is a Go goroutine (not a thread, not a browser process) — extremely memory-efficient',
      'Your JavaScript test script runs inside a Goja JS runtime embedded in Go — not Node.js',
      'k6 sends real HTTP requests and measures: response time, error rate, throughput, connection time',
      'Thresholds are evaluated in real-time — k6 exits with error code 1 if any threshold is breached (CI-friendly)',
      'Grafana can consume k6 output via InfluxDB for live dashboards during load tests',
    ],
    diagram: ['k6 Go binary', '→ Goja JS runtime (runs your script)', '→ Virtual Users (goroutines)', '→ Real HTTP requests', '→ Metrics: P50/P95/P99/error rate', '→ Thresholds → pass/fail'],
  },
  {
    tool: 'Appium', icon: '📱', color: '#662d8c',
    headline: 'Wraps native mobile automation frameworks behind the WebDriver protocol',
    mechanism: [
      'Appium is an HTTP server that exposes the W3C WebDriver protocol — the same API as Selenium',
      'For Android: Appium\'s UiAutomator2 driver sends commands to Google\'s UiAutomator2 framework inside the device/emulator',
      'For iOS: Appium\'s XCUITest driver communicates with Apple\'s XCUITest framework via WebDriverAgent running on the device',
      'Your test code only knows about WebDriver commands — Appium handles the platform translation',
      'No app source code needed — Appium automates the installed APK/IPA by inspecting the UI accessibility tree',
    ],
    diagram: ['Test Code (any language)', '→ HTTP WebDriver protocol', '→ Appium Server (Node.js)', '→ UiAutomator2 (Android) / XCUITest (iOS)', '→ Real device or emulator', '→ App UI elements'],
  },
];

/* ─── Component ─────────────────────────────────────────── */

export default function AutomationToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedHow, setExpandedHow] = useState<string | null>(null);

  const copy = (key: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto', flexShrink: 0, background: 'rgba(255,255,255,0.01)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600,
              whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0,
              background: activeTab === t.id ? 'rgba(99,102,241,0.18)' : 'transparent',
              border: `1px solid ${activeTab === t.id ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
              color: activeTab === t.id ? '#a5b4fc' : '#64748b',
            }}>{t.icon} {t.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>

          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🧪 Automation Tools — Installation & Overview</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Every major test automation tool used in professional QA — what it is, when to use it, and how to install it.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 32 }}>
                {tools.map(t => (
                  <div key={t.name} style={{ background: '#12121a', border: `1px solid ${t.color}25`, borderRadius: 14, padding: '18px 20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${t.color}20`, color: t.textColor || t.color, border: `1px solid ${t.color}30` }}>{t.badge}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: 28 }}>{t.icon}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{t.vendor}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[{ l: 'Type', v: t.type }, { l: 'Language', v: t.lang }, { l: 'Best for', v: t.best }].map(r => (
                        <div key={r.l} style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 10, color: '#475569', width: 52, flexShrink: 0, paddingTop: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.l}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab(t.name.toLowerCase().split(' ')[0] as Tab)} style={{ marginTop: 14, width: '100%', padding: '8px', borderRadius: 8, background: `${t.color}12`, border: `1px solid ${t.color}30`, color: t.textColor || t.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      Install Guide →
                    </button>
                  </div>
                ))}
              </div>

              {/* Choosing guide */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>🤔 Which Tool Should I Learn First?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { scenario: 'I\'m new to automation and want to start fast', answer: 'Start with Playwright — best docs, cross-browser, works in JS/TS/Python. One week to first test.', color: '#45ba4b' },
                    { scenario: 'My team is a React/Vue frontend team', answer: 'Cypress for component tests + Playwright for E2E. Cypress\'s DX is excellent for frontend devs.', color: '#69d3a7' },
                    { scenario: 'My company uses Java / Spring Boot', answer: 'Selenium + JUnit/TestNG. Industry-standard stack for Java shops. Also consider Playwright Java.', color: '#43b02a' },
                    { scenario: 'I need to test REST APIs', answer: 'Start with Postman for exploration, then automate with Newman in CI. Or use Playwright\'s request fixture.', color: '#ff6c37' },
                    { scenario: 'I need to check if the app can handle 1000 users', answer: 'k6 — it\'s purpose-built for load testing, outputs CI-friendly pass/fail thresholds.', color: '#7d64ff' },
                    { scenario: 'I need to test iOS and Android apps', answer: 'Appium with WebdriverIO. Takes a day to set up but gives you native mobile automation in JS.', color: '#662d8c' },
                    { scenario: 'I need unit tests for business logic', answer: 'Jest (or Vitest for Vite projects). Fast, zero-config, excellent mocking system.', color: '#c21325' },
                  ].map(({ scenario, answer, color }) => (
                    <div key={scenario} style={{ display: 'flex', gap: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 9, borderLeft: `3px solid ${color}` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>📌 {scenario}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>→ {answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version quick-ref */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>⚡ Quick Install Reference</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Tool', 'Install Command', 'Run Command'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {[
                        { tool: '🎭 Playwright', install: 'npm init playwright@latest', run: 'npx playwright test' },
                        { tool: '🌲 Cypress', install: 'npm install --save-dev cypress', run: 'npx cypress open' },
                        { tool: '🤖 Selenium (Python)', install: 'pip install selenium', run: 'pytest tests/' },
                        { tool: '🃏 Jest', install: 'npm install --save-dev jest', run: 'npx jest' },
                        { tool: '⚡ Vitest', install: 'npm install --save-dev vitest', run: 'npx vitest' },
                        { tool: '📮 Newman (Postman CLI)', install: 'npm install -g newman', run: 'newman run collection.json' },
                        { tool: '📊 k6', install: 'brew install k6  /  winget install k6', run: 'k6 run script.js' },
                        { tool: '📱 Appium', install: 'npm install -g appium', run: 'appium' },
                      ].map((r, i) => (
                        <tr key={r.tool} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '9px 16px', color: '#e2e8f0', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.tool}</td>
                          <td style={{ padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><code style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 }}>{r.install}</code></td>
                          <td style={{ padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><code style={{ color: '#10b981', fontFamily: 'monospace', fontSize: 11 }}>{r.run}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ INSTALL GUIDES ═══ */}
          {activeTab !== 'overview' && activeTab !== 'how-it-works' && (guides as Record<string, unknown>)[activeTab] && (guides[activeTab as keyof typeof guides] as unknown[])?.length > 0 && (
            <div>
              {(() => {
                const meta: Record<string, { color: string; icon: string; tagline: string }> = {
                  playwright: { color: '#45ba4b', icon: '🎭', tagline: 'Microsoft\'s modern cross-browser testing framework — runs Chromium, Firefox, and WebKit' },
                  cypress: { color: '#69d3a7', icon: '🌲', tagline: 'Fast E2E testing that runs inside the browser — great DX, real-time reloading' },
                  selenium: { color: '#43b02a', icon: '🤖', tagline: 'Industry-standard WebDriver protocol — supports every browser, every language' },
                  jest: { color: '#c21325', icon: '🃏', tagline: 'Zero-config JavaScript unit testing by Meta — also runs React component tests' },
                  postman: { color: '#ff6c37', icon: '📮', tagline: 'API platform for building and testing APIs — Newman brings it to CI/CD' },
                  k6: { color: '#7d64ff', icon: '📊', tagline: 'Developer-centric load testing by Grafana Labs — write tests in JavaScript' },
                  appium: { color: '#662d8c', icon: '📱', tagline: 'Open-source mobile automation for iOS and Android native, hybrid, and web apps' },
                };
                const m = meta[activeTab] || { color: '#6366f1', icon: '🧪', tagline: '' };
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                      <span style={{ fontSize: 32 }}>{m.icon}</span>
                      <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#f1f5f9' }}>{tabs.find(t => t.id === activeTab)?.label} — Installation & Setup</h1>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{m.tagline}</p>
                      </div>
                    </div>
                    {guides[activeTab].map((section, si) => (
                      <div key={si} style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ padding: '12px 20px', background: `${m.color}0a`, borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700, color: m.color }}>{section.title}</div>
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {section.steps.map((step, i) => (
                            <div key={i}>
                              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: step.code ? 8 : 0, lineHeight: 1.6 }}>{step.heading}</div>
                              {step.code && <CodeBlock codeKey={`${activeTab}-${si}-${i}`} code={step.code} copiedKey={copiedKey} onCopy={copy} />}
                              {step.note && <div style={{ marginTop: 6, padding: '8px 12px', background: `${m.color}09`, border: `1px solid ${m.color}25`, borderRadius: 7, fontSize: 11, color: m.color }}>{step.note}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ═══ HOW IT WORKS ═══ */}
          {activeTab === 'how-it-works' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>⚙️ How Automation Tools Work Under the Hood</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Understanding the internal mechanics of each tool makes you a far better tester — you understand why things fail, why some tools are faster, and what the right tool is for each job.
              </p>
              {howItWorks.map((item, i) => (
                <div key={item.tool} style={{ background: '#12121a', border: `1px solid ${expandedHow === item.tool ? item.color + '40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden', marginBottom: 14, transition: 'all 0.18s' }}>
                  <div onClick={() => setExpandedHow(expandedHow === item.tool ? null : item.tool)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: `${item.color}18`, border: `1px solid ${item.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.tool}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{item.headline}</div>
                    </div>
                    <span style={{ color: '#475569', fontSize: 13 }}>{expandedHow === item.tool ? '▲' : '▼'}</span>
                  </div>
                  {expandedHow === item.tool && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {/* Flow diagram */}
                      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', padding: '12px 0' }}>
                        {item.diagram.map((step, di) => (
                          <div key={di} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{ padding: '6px 12px', borderRadius: 8, background: `${item.color}${di === 0 ? '25' : '12'}`, border: `1px solid ${item.color}30`, fontSize: 11, color: di === 0 ? item.color : '#94a3b8', fontWeight: di === 0 ? 700 : 400, whiteSpace: 'nowrap' }}>{step}</div>
                            {di < item.diagram.length - 1 && <div style={{ width: 20, height: 1, background: `${item.color}40`, flexShrink: 0 }} />}
                          </div>
                        ))}
                      </div>
                      {/* Mechanism steps */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {item.mechanism.map((point, pi) => (
                          <div key={pi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ color: item.color, fontWeight: 800, fontSize: 12, flexShrink: 0, width: 20, paddingTop: 1 }}>{pi + 1}.</span>
                            <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Comparison table */}
              <div style={{ marginTop: 24, background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>🏎️ Speed & Architecture Comparison</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Tool', 'Architecture', 'Speed', 'Parallelism', 'Browser Required'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {[
                        { tool: '🎭 Playwright', arch: 'CDP / browser protocols', speed: '⚡⚡⚡ Fast', parallel: 'Built-in sharding + workers', browser: '✅ Yes (bundled)' },
                        { tool: '🌲 Cypress', arch: 'In-browser JS + proxy', speed: '⚡⚡ Medium', parallel: 'Cypress Cloud (paid)', browser: '✅ Yes (bundled)' },
                        { tool: '🤖 Selenium', arch: 'HTTP → WebDriver → browser', speed: '⚡ Slower', parallel: 'Selenium Grid', browser: '✅ Yes (external)' },
                        { tool: '🃏 Jest', arch: 'Node.js process, jsdom', speed: '⚡⚡⚡⚡ Very fast', parallel: 'Worker threads auto', browser: '❌ No (jsdom simulates)' },
                        { tool: '📊 k6', arch: 'Go goroutines + Goja JS', speed: '⚡⚡⚡⚡ Extremely fast', parallel: 'Massive (10k+ VUs)', browser: '❌ No (HTTP only)' },
                        { tool: '📱 Appium', arch: 'HTTP → UiAutomator2/XCUITest', speed: '⚡ Slow (real device)', parallel: 'Device farm needed', browser: '❌ Native app' },
                      ].map((r, i) => (
                        <tr key={r.tool} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px 14px', color: '#e2e8f0', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.tool}</td>
                          <td style={{ padding: '10px 14px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: 'monospace', fontSize: 11 }}>{r.arch}</td>
                          <td style={{ padding: '10px 14px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.speed}</td>
                          <td style={{ padding: '10px 14px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.parallel}</td>
                          <td style={{ padding: '10px 14px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.browser}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CodeBlock({ codeKey, code, copiedKey, onCopy }: { codeKey: string; code: string; copiedKey: string | null; onCopy: (k: string, c: string) => void }) {
  return (
    <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => onCopy(codeKey, code)} style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, cursor: 'pointer', fontWeight: 700, background: copiedKey === codeKey ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)', border: `1px solid ${copiedKey === codeKey ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.25)'}`, color: copiedKey === codeKey ? '#10b981' : '#a5b4fc' }}>
          {copiedKey === codeKey ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '12px 16px', fontSize: 12, lineHeight: 1.7, color: '#a5b4fc', fontFamily: '"Fira Code","Consolas",monospace', overflowX: 'auto', whiteSpace: 'pre' }}>{code}</pre>
    </div>
  );
}
