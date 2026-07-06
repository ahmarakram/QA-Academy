'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

/* ─── Types ─────────────────────────────────────────────── */
type Tab = 'overview' | 'claude-code' | 'copilot' | 'cursor' | 'codeium' | 'tabnine' | 'cli-tools' | 'qa-workflows';

/* ─── Data ──────────────────────────────────────────────── */

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'overview', icon: '🗺️', label: 'Overview' },
  { id: 'claude-code', icon: '🤖', label: 'Claude Code' },
  { id: 'copilot', icon: '✈️', label: 'GitHub Copilot' },
  { id: 'cursor', icon: '🖱️', label: 'Cursor IDE' },
  { id: 'codeium', icon: '⚡', label: 'Codeium / Windsurf' },
  { id: 'tabnine', icon: '🔵', label: 'Tabnine' },
  { id: 'cli-tools', icon: '💻', label: 'AI CLI Tools' },
  { id: 'qa-workflows', icon: '🧪', label: 'QA Workflows' },
];

const tools = [
  {
    name: 'Claude Code', icon: '🤖', color: '#6366f1', vendor: 'Anthropic',
    type: 'CLI + IDE extension', free: 'Pay per token', ide: 'VS Code, JetBrains, CLI',
    best: 'Codebase-wide refactors, test writing, debugging, agentic tasks',
    badge: 'Best for QA',
  },
  {
    name: 'GitHub Copilot', icon: '✈️', color: '#2563eb', vendor: 'GitHub / Microsoft',
    type: 'IDE extension + CLI', free: 'Free tier (limited)', ide: 'VS Code, JetBrains, Vim, Neovim, CLI',
    best: 'Inline autocomplete, PR summaries, code review comments',
    badge: 'Most Popular',
  },
  {
    name: 'Cursor', icon: '🖱️', color: '#8b5cf6', vendor: 'Anysphere',
    type: 'Full IDE (VS Code fork)', free: 'Free tier (2,000 completions)', ide: 'Standalone IDE',
    best: 'Multi-file AI edits, natural language refactors, chat with codebase',
    badge: 'Best IDE Experience',
  },
  {
    name: 'Codeium / Windsurf', icon: '⚡', color: '#10b981', vendor: 'Codeium',
    type: 'IDE extension + Windsurf IDE', free: 'Free (unlimited completions)', ide: 'VS Code, JetBrains, Neovim, Windsurf IDE',
    best: 'Free alternative to Copilot, fast autocomplete, Windsurf is Cursor competitor',
    badge: 'Best Free Option',
  },
  {
    name: 'Tabnine', icon: '🔵', color: '#0ea5e9', vendor: 'Tabnine',
    type: 'IDE extension', free: 'Free tier', ide: 'VS Code, JetBrains, Eclipse, Vim',
    best: 'Privacy-first AI (runs locally), team code style learning, enterprise',
    badge: 'Most Private',
  },
  {
    name: 'Aider', icon: '💬', color: '#f59e0b', vendor: 'Open source',
    type: 'CLI tool', free: '100% free (use own API key)', ide: 'Terminal (works with any editor)',
    best: 'Git-aware AI coding in terminal, multi-file edits, automatic commits',
    badge: 'Best CLI Tool',
  },
];

const installSteps: Record<Tab, { title: string; steps: { heading: string; code?: string; note?: string }[] }[]> = {
  overview: [],
  'qa-workflows': [],
  'cli-tools': [],

  'claude-code': [
    {
      title: '1. Install Node.js (prerequisite)',
      steps: [
        { heading: 'Download Node.js 18+ from nodejs.org, then verify:', code: 'node --version\nnpm --version' },
      ],
    },
    {
      title: '2. Install Claude Code CLI',
      steps: [
        { heading: 'Install globally via npm:', code: 'npm install -g @anthropic-ai/claude-code' },
        { heading: 'Verify installation:', code: 'claude --version' },
      ],
    },
    {
      title: '3. Authenticate',
      steps: [
        { heading: 'Run the login command — opens browser to authenticate:', code: 'claude' },
        { heading: 'Or set API key directly (for CI/CD environments):', code: 'export ANTHROPIC_API_KEY="sk-ant-..."' },
      ],
    },
    {
      title: '4. Install VS Code Extension',
      steps: [
        { heading: 'Open VS Code → Extensions (Ctrl+Shift+X) → Search "Claude Code"', note: 'Extension ID: anthropic.claude-code' },
        { heading: 'Or install via terminal:', code: 'code --install-extension anthropic.claude-code' },
      ],
    },
    {
      title: '5. Install JetBrains Plugin',
      steps: [
        { heading: 'Open Settings → Plugins → Marketplace → Search "Claude Code"', note: 'Works in IntelliJ IDEA, PyCharm, WebStorm, GoLand, Rider' },
      ],
    },
    {
      title: '6. Start using Claude Code',
      steps: [
        { heading: 'In any project directory, start a session:', code: 'cd my-project\nclaude\n# Then type your request in natural language\n# Example: "Write Playwright tests for the login page"' },
        { heading: 'Common QA commands:', code: '# Write tests\nclaude "Write Playwright E2E tests for the checkout flow"\n\n# Debug a failing test\nclaude "This Playwright test is failing: [paste error]. Fix it."\n\n# Generate test data\nclaude "Generate 20 realistic test user objects for this schema"' },
      ],
    },
  ],

  copilot: [
    {
      title: '1. Subscribe to GitHub Copilot',
      steps: [
        { heading: 'Go to github.com → Settings → Copilot → Enable (free for students/OSS maintainers)', note: 'Individual plan: $10/month or $100/year. Free tier available as of 2024.' },
      ],
    },
    {
      title: '2. Install in VS Code',
      steps: [
        { heading: 'Install the extension:', code: 'code --install-extension GitHub.copilot\ncode --install-extension GitHub.copilot-chat' },
        { heading: 'Sign in: VS Code will prompt you to authenticate with GitHub automatically.' },
      ],
    },
    {
      title: '3. Install in JetBrains (IntelliJ, PyCharm, WebStorm)',
      steps: [
        { heading: 'Settings → Plugins → Marketplace → Search "GitHub Copilot" → Install → Restart IDE', note: 'Then: Tools → GitHub Copilot → Login to GitHub' },
      ],
    },
    {
      title: '4. Install GitHub Copilot CLI',
      steps: [
        { heading: 'Install via npm:', code: 'npm install -g @githubnext/github-copilot-cli' },
        { heading: 'Authenticate:', code: 'github-copilot-cli auth' },
        { heading: 'Use natural language for shell commands:', code: '# Ask for a git command\ngit? "undo my last commit but keep changes"\n\n# Ask for a shell command\n??  "find all .test.ts files modified in the last 7 days"\n\n# Ask to explain a command\ngit! "git rebase -i HEAD~3"' },
      ],
    },
    {
      title: '5. VS Code Chat & Inline Edit shortcuts',
      steps: [
        { heading: 'Key shortcuts:', code: 'Ctrl+I          → Inline AI edit (Copilot Edits)\nCtrl+Shift+I    → Open Copilot Chat panel\nTab             → Accept a completion suggestion\nEsc             → Dismiss suggestion\nAlt+\\           → Trigger suggestion manually' },
      ],
    },
  ],

  cursor: [
    {
      title: '1. Download and Install Cursor',
      steps: [
        { heading: 'Download from cursor.com for your OS (Windows/macOS/Linux)', note: 'Cursor is a full IDE — a VS Code fork. Your VS Code extensions and settings can be imported.' },
      ],
    },
    {
      title: '2. Import your VS Code profile (optional)',
      steps: [
        { heading: 'On first launch: "Import VS Code Settings" → transfers all extensions, themes, keybindings automatically.', note: 'This makes the transition seamless if you already use VS Code.' },
      ],
    },
    {
      title: '3. Configure AI model',
      steps: [
        { heading: 'Cursor Settings → Models → Choose default model:', note: 'Options: claude-3.5-sonnet (default, best), GPT-4o, o1-mini. Cursor uses your Anthropic/OpenAI key or their subscription.' },
        { heading: 'Add your own API keys in Settings → API Keys (optional — use free tier credits first).' },
      ],
    },
    {
      title: '4. Key Cursor features and shortcuts',
      steps: [
        { heading: 'Core shortcuts:', code: 'Ctrl+K          → Open inline AI edit bar (edit selected code with natural language)\nCtrl+L          → Open Chat panel (chat with codebase)\nCtrl+Shift+J    → Open Composer (multi-file AI edits)\nTab             → Accept AI completion\n@filename       → Reference a specific file in chat\n@codebase       → Search entire codebase with AI' },
        { heading: 'Example QA prompts in Cursor:', code: '# In Ctrl+L (Chat):\n"@playwright-tests Write tests for the cart component"\n"@src/utils Find all functions that handle authentication and add error handling"\n\n# In Ctrl+K (Inline):\n# Select a function, then type:\n"Add try/catch and log errors to console"' },
      ],
    },
    {
      title: '5. Set up .cursorrules for QA projects',
      steps: [
        { heading: 'Create a .cursorrules file in your project root to guide AI behavior:', code: '# .cursorrules\nYou are a QA engineer working on a Next.js + Playwright test suite.\n\nWhen writing tests:\n- Always use data-testid attributes for selectors, not CSS classes\n- Use Page Object Model pattern\n- Include both happy path and error scenarios\n- Add meaningful test descriptions\n- Use fixtures for repeated setup\n\nWhen reviewing code:\n- Check for missing error handling\n- Flag hardcoded test data that should be fixtures\n- Suggest assertions that cover edge cases' },
      ],
    },
  ],

  codeium: [
    {
      title: '1. Install Codeium in VS Code',
      steps: [
        { heading: 'Install from Marketplace:', code: 'code --install-extension Codeium.codeium' },
        { heading: 'Create free account at codeium.com and sign in via the extension.' },
      ],
    },
    {
      title: '2. Install in JetBrains IDEs',
      steps: [
        { heading: 'Settings → Plugins → Marketplace → Search "Codeium" → Install', note: 'Works in IntelliJ, PyCharm, WebStorm, GoLand, Android Studio, CLion' },
        { heading: 'After install: Codeium icon in status bar → Login with Codeium account' },
      ],
    },
    {
      title: '3. Install Windsurf IDE (Codeium\'s full IDE)',
      steps: [
        { heading: 'Download from codeium.com/windsurf — similar to Cursor, a full VS Code fork.', note: 'Windsurf has "Cascade" — an AI agent that plans and executes multi-step coding tasks autonomously.' },
        { heading: 'Cascade agent shortcuts:', code: 'Ctrl+L          → Open Cascade chat\nCtrl+I          → Inline AI edit\n@file           → Reference files in chat\nCtrl+Shift+L    → Open command palette' },
      ],
    },
    {
      title: '4. VS Code keyboard shortcuts',
      steps: [
        { heading: 'Core shortcuts for Codeium in VS Code:', code: 'Tab             → Accept suggestion\nAlt+]           → Next suggestion\nAlt+[           → Previous suggestion\nAlt+Escape      → Dismiss suggestion\nCtrl+Shift+/    → Open Codeium Chat' },
      ],
    },
  ],

  tabnine: [
    {
      title: '1. Install Tabnine in VS Code',
      steps: [
        { heading: 'Install from Marketplace:', code: 'code --install-extension TabNine.tabnine-vscode' },
        { heading: 'Create account or use local model (Pro required for cloud AI, Basic is local-only).' },
      ],
    },
    {
      title: '2. Install in JetBrains',
      steps: [
        { heading: 'Settings → Plugins → Marketplace → Search "Tabnine AI" → Install → Restart', note: 'Supports IntelliJ, PyCharm, WebStorm, GoLand, Rider, CLion, DataGrip' },
      ],
    },
    {
      title: '3. Run Tabnine locally (privacy mode)',
      steps: [
        { heading: 'Enable local model in Settings → Tabnine → Use local model', note: 'Local model runs on your machine — code never leaves. Slower and smaller than cloud model, but fully private. Required for regulated industries (healthcare, finance, defense).' },
        { heading: 'System requirements for local model:', code: '# Minimum:\n# CPU: 8-core modern processor\n# RAM: 16 GB\n# Storage: 5 GB free space\n\n# Recommended for best performance:\n# GPU: NVIDIA GPU with 8 GB VRAM\n# RAM: 32 GB' },
      ],
    },
    {
      title: '4. Team training (Enterprise)',
      steps: [
        { heading: 'Tabnine Enterprise can train on your private codebase:', note: 'Admin sets up a private Tabnine server that indexes your repos. Team members\' completions are personalized to your codebase\'s patterns, naming conventions, and internal APIs.' },
      ],
    },
  ],

  'cli-tools': [
    {
      title: 'Aider — AI pair programming in terminal',
      steps: [
        { heading: 'Install via pip:', code: 'pip install aider-chat\n\n# Or with pipx (recommended — isolated environment):\npipx install aider-chat' },
        { heading: 'Set your API key:', code: 'export OPENAI_API_KEY="sk-..."\n# or\nexport ANTHROPIC_API_KEY="sk-ant-..."' },
        { heading: 'Start a session in your project:', code: 'cd my-project\naider --model claude-3-5-sonnet-20241022\n\n# Add files to the context:\naider src/tests/login.test.ts src/pages/login.tsx\n\n# Then type in natural language:\n> Add edge case tests for invalid email formats' },
        { heading: 'Aider automatically commits each change with a descriptive message — great for QA test writing.' },
      ],
    },
    {
      title: 'OpenAI CLI',
      steps: [
        { heading: 'Install:', code: 'pip install openai\n# or\nnpm install -g openai' },
        { heading: 'Usage:', code: 'export OPENAI_API_KEY="sk-..."\n\n# Quick prompt from terminal:\nopenai api chat.completions.create \\\n  -m gpt-4o \\\n  -g user "Write a Jest test for this function: [paste code]"' },
      ],
    },
    {
      title: 'llm — Universal LLM CLI (Simon Willison)',
      steps: [
        { heading: 'Install:', code: 'pip install llm\n\n# Add plugins for different providers:\nllm install llm-claude-3\nllm install llm-gemini' },
        { heading: 'Usage:', code: '# Set default key\nllm keys set anthropic\n\n# Run a prompt\nllm "List 10 edge cases to test for a login form"\n\n# Pipe code into it\ncat src/auth.ts | llm "What security vulnerabilities does this have?"\n\n# Continue a conversation\nllm -c "Now write Playwright tests for the issues you found"' },
      ],
    },
    {
      title: 'GitHub Copilot CLI',
      steps: [
        { heading: 'Install and auth:', code: 'npm install -g @githubnext/github-copilot-cli\ngithub-copilot-cli auth' },
        { heading: 'Usage:', code: '# Natural language → shell command\ngit? "create a branch called feature/login-tests and switch to it"\n\n# Natural language → any command\n?? "run only the tests in the auth folder and save output to a file"\n\n# Explain a command\ngit! "git log --oneline --graph --all --decorate"' },
      ],
    },
    {
      title: 'Ollama — Run AI models locally',
      steps: [
        { heading: 'Install Ollama from ollama.com (macOS/Linux/Windows):', code: 'curl -fsSL https://ollama.com/install.sh | sh' },
        { heading: 'Pull and run a model:', code: '# Pull a model (downloads once, runs locally forever)\nollama pull llama3.2\nollama pull codellama\nollama pull deepseek-coder\n\n# Chat interactively\nollama run codellama\n\n# Pipe code for analysis\ncat test.ts | ollama run codellama "Explain this test and suggest improvements"' },
        { heading: 'Use Ollama with Continue.dev extension (VS Code):', note: 'Continue is an open-source VS Code extension that connects to Ollama for fully local, private AI coding assistance.' },
      ],
    },
  ],

  'qa-workflows': [],
};

const qaWorkflows = [
  {
    title: 'Write Playwright tests from a user story',
    tool: 'Claude Code', icon: '🤖', color: '#6366f1',
    steps: [
      'Open your project in terminal',
      'Run: claude',
      'Paste the user story: "As a user, I want to log in with email and password..."',
      'Type: "Write Playwright tests covering the happy path and all error scenarios for this user story"',
      'Claude will read your existing code structure and generate tests that match your patterns',
      'Review generated tests, then commit',
    ],
    tip: 'Reference your existing test files first: "Look at src/tests/signup.test.ts for the testing patterns we use, then write similar tests for login"',
  },
  {
    title: 'Debug a failing CI test',
    tool: 'GitHub Copilot Chat', icon: '✈️', color: '#2563eb',
    steps: [
      'Copy the full error message and stack trace from CI',
      'Open Copilot Chat (Ctrl+Shift+I) in VS Code',
      'Paste: "This Playwright test fails in CI but passes locally. Error: [paste error]"',
      'Copilot will suggest the most common CI-specific causes: missing waits, env differences, port conflicts',
      'Apply the fix and push',
    ],
    tip: 'Include the test file contents: @tests/login.test.ts "Why is this test flaky in CI?"',
  },
  {
    title: 'Review API response for test coverage gaps',
    tool: 'llm CLI', icon: '💬', color: '#f59e0b',
    steps: [
      'Save the API response JSON to a file: curl -s http://localhost:3000/api/users > response.json',
      'Run: cat response.json | llm "What edge cases and validation scenarios should I test for this API response?"',
      'Take the suggestions and write tests for each scenario',
      'Run: llm -c "Now write the Jest/Supertest assertions for each scenario you listed"',
    ],
    tip: 'Pipe your OpenAPI spec: cat openapi.yaml | llm "What are the most important test scenarios for this API?"',
  },
  {
    title: 'Generate test data at scale',
    tool: 'Cursor', icon: '🖱️', color: '#8b5cf6',
    steps: [
      'Open your project in Cursor',
      'Open Ctrl+L (Chat)',
      'Reference your schema: "@src/types/user.ts Generate a TypeScript factory function that creates 50 realistic test users with varied data"',
      'Cursor reads your actual types and generates matching data',
      'Ask follow-up: "Now add edge case users: empty name, very long email, special characters in password"',
    ],
    tip: 'Use .cursorrules to teach Cursor your team\'s test data conventions once, then it applies them automatically.',
  },
  {
    title: 'Perform AI-assisted code review before merging',
    tool: 'Claude Code', icon: '🤖', color: '#6366f1',
    steps: [
      'After finishing a feature branch, run in terminal:',
      'claude "Review the changes in this PR for: 1) missing test coverage 2) security issues 3) edge cases not handled. Compare git diff main"',
      'Claude reads the actual diff and gives specific, actionable feedback',
      'Fix the issues Claude finds, then open your real PR',
    ],
    tip: 'Add this as a pre-commit hook or a step in your local development workflow to catch issues before CI even runs.',
  },
  {
    title: 'Convert manual test cases to automated tests',
    tool: 'Any AI tool', icon: '⚡', color: '#10b981',
    steps: [
      'Export your manual test cases from TestRail/Jira/spreadsheet as text',
      'Paste into AI chat: "Convert these manual test cases to Playwright tests. Use Page Object Model pattern."',
      'Paste 10–20 test cases at once',
      'AI generates the test code structure — review and fill in the actual selectors',
      'Run the tests to verify they work, then commit the suite',
    ],
    tip: 'Do this in batches of 10 test cases. Quality is better when the AI focuses on a small, coherent set.',
  },
];

/* ─── Component ─────────────────────────────────────────── */

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<number | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', gap: 4, padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          overflowX: 'auto', flexShrink: 0, background: 'rgba(255,255,255,0.01)',
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0,
                background: activeTab === t.id ? 'rgba(99,102,241,0.18)' : 'transparent',
                border: `1px solid ${activeTab === t.id ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: activeTab === t.id ? '#a5b4fc' : '#64748b',
              }}
            >{t.icon} {t.label}</button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>

          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🤖 AI Tools for Developers & QA Engineers</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Every major AI coding assistant, how to install it, and how to use it for QA work. From IDE extensions to CLI tools that run in your terminal.
              </p>

              {/* Tool comparison grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginBottom: 32 }}>
                {tools.map(tool => (
                  <div key={tool.name} style={{
                    background: '#12121a', border: `1px solid ${tool.color}25`,
                    borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 12, right: 12, padding: '3px 10px',
                      borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}30`,
                    }}>{tool.badge}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ fontSize: 28 }}>{tool.icon}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{tool.name}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{tool.vendor}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[
                        { label: 'Type', value: tool.type },
                        { label: 'Price', value: tool.free },
                        { label: 'IDEs', value: tool.ide },
                        { label: 'Best for', value: tool.best },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 10, color: '#475569', width: 44, flexShrink: 0, paddingTop: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{row.label}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveTab(tool.name.toLowerCase().replace(' ', '-').replace(/\s+.*/, '') as Tab)}
                      style={{
                        marginTop: 14, width: '100%', padding: '8px', borderRadius: 8,
                        background: `${tool.color}12`, border: `1px solid ${tool.color}30`,
                        color: tool.color, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >View Installation Guide →</button>
                  </div>
                ))}
              </div>

              {/* Quick comparison table */}
              <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
                  📊 Quick Comparison — Which Tool is Right for You?
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        {['Tool', 'Free?', 'Works offline?', 'Best IDE', 'QA Use Case'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tool: '🤖 Claude Code', free: 'Pay per use', offline: '❌', ide: 'VS Code / CLI', qa: 'Write full test suites, refactor' },
                        { tool: '✈️ GitHub Copilot', free: 'Free tier', offline: '❌', ide: 'VS Code', qa: 'Autocomplete assertions, PR reviews' },
                        { tool: '🖱️ Cursor', free: '2000 free/mo', offline: '❌', ide: 'Standalone', qa: 'Multi-file test refactors' },
                        { tool: '⚡ Codeium', free: '✅ Unlimited', offline: '❌', ide: 'VS Code / Windsurf', qa: 'Fast autocomplete, free Copilot alt' },
                        { tool: '🔵 Tabnine', free: '✅ Basic', offline: '✅ Local model', ide: 'VS Code / JB', qa: 'Private code, enterprise teams' },
                        { tool: '💬 Aider CLI', free: '✅ (own key)', offline: 'Partial', ide: 'Terminal', qa: 'Git-aware test writing in terminal' },
                        { tool: '🏠 Ollama', free: '✅ 100%', offline: '✅ 100%', ide: 'Any (via API)', qa: 'Fully private, no data sent anywhere' },
                      ].map((row, i) => (
                        <tr key={row.tool} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px 16px', color: '#e2e8f0', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.tool}</td>
                          <td style={{ padding: '10px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.free}</td>
                          <td style={{ padding: '10px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.offline}</td>
                          <td style={{ padding: '10px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.ide}</td>
                          <td style={{ padding: '10px 16px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.qa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ INSTALLATION GUIDES ═══ */}
          {(['claude-code', 'copilot', 'cursor', 'codeium', 'tabnine'] as Tab[]).includes(activeTab) && installSteps[activeTab]?.length > 0 && (
            <InstallGuide
              tab={activeTab}
              steps={installSteps[activeTab]}
              copiedKey={copiedKey}
              onCopy={copyCode}
            />
          )}

          {/* ═══ CLI TOOLS ═══ */}
          {activeTab === 'cli-tools' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>💻 AI CLI Tools</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Powerful AI tools that live in your terminal — no IDE required. Perfect for scripting, CI pipelines, and quick code analysis.
              </p>
              {installSteps['cli-tools'].map((section, si) => (
                <div key={si} style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
                    {section.title}
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    {section.steps.map((step, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: step.code ? 8 : 0 }}>{step.heading}</div>
                        {step.code && <CodeBlock codeKey={`cli-${si}-${i}`} code={step.code} copiedKey={copiedKey} onCopy={copyCode} />}
                        {step.note && <div style={{ marginTop: 6, padding: '8px 12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 7, fontSize: 11, color: '#a5b4fc' }}>{step.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══ QA WORKFLOWS ═══ */}
          {activeTab === 'qa-workflows' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🧪 AI-Powered QA Workflows</h1>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                Real step-by-step workflows for using AI tools in your daily QA work — from writing tests to debugging CI failures.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {qaWorkflows.map((wf, i) => (
                  <div key={i} style={{
                    background: '#12121a', border: `1px solid ${expandedWorkflow === i ? wf.color + '40' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 14, overflow: 'hidden', transition: 'all 0.18s',
                  }}>
                    <div
                      onClick={() => setExpandedWorkflow(expandedWorkflow === i ? null : i)}
                      style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: `${wf.color}18`, border: `1px solid ${wf.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{wf.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{wf.title}</div>
                        <div style={{ fontSize: 11, color: wf.color, fontWeight: 600 }}>Using: {wf.tool}</div>
                      </div>
                      <span style={{ color: '#475569', fontSize: 13 }}>{expandedWorkflow === i ? '▲' : '▼'}</span>
                    </div>
                    {expandedWorkflow === i && (
                      <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {wf.steps.map((step, si) => (
                            <div key={si} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                                background: `${wf.color}18`, border: `1px solid ${wf.color}35`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 800, color: wf.color,
                              }}>{si + 1}</div>
                              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, paddingTop: 2 }}>
                                {step.includes(':') && step.startsWith('Run:') ? (
                                  <><span style={{ color: '#64748b' }}>{step.split(':')[0]}: </span><code style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: 12 }}>{step.split(':').slice(1).join(':')}</code></>
                                ) : step}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 14, padding: '10px 14px', background: `${wf.color}09`, border: `1px solid ${wf.color}25`, borderRadius: 9 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: wf.color }}>💡 Pro tip: </span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{wf.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Prompt library */}
              <div style={{ marginTop: 28, background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 14 }}>📋 QA Prompt Library — Copy & Use</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Generate test cases from acceptance criteria', prompt: 'Given this acceptance criteria: [paste AC], generate a comprehensive set of test cases covering happy path, error cases, edge cases, and boundary values. Format as a numbered list with: Test ID, Scenario, Precondition, Steps, Expected Result.' },
                    { label: 'Convert Postman collection to Playwright', prompt: 'Convert this Postman collection to Playwright API tests using the built-in request() context. Preserve all the request headers, body, and assertions: [paste JSON]' },
                    { label: 'Find selector for an element', prompt: 'I need a Playwright selector for this HTML element that is: 1) Resilient to class changes 2) Not dependent on position 3) Descriptive. HTML: [paste element]' },
                    { label: 'Review test for best practices', prompt: 'Review this Playwright test for: 1) Hardcoded waits that should use auto-waiting 2) Brittle selectors 3) Missing assertions 4) Missing error scenarios. Suggest improvements: [paste test]' },
                    { label: 'Generate k6 load test from API spec', prompt: 'Write a k6 load test script for this endpoint: [URL + method + body]. Include: ramp-up stage, steady state, spike test, and thresholds for P95 < 500ms and error rate < 1%.' },
                    { label: 'Write bug report from test failure', prompt: 'Write a professional bug report from this test failure. Include: Title, Severity, Environment, Steps to Reproduce, Expected Result, Actual Result, and Suggested Fix. Failure: [paste error/screenshot description]' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9, overflow: 'hidden' }}>
                      <div style={{ padding: '8px 14px', background: 'rgba(99,102,241,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12, fontWeight: 600, color: '#a5b4fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.label}</span>
                        <button
                          onClick={() => copyCode(`prompt-${i}`, item.prompt)}
                          style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, cursor: 'pointer', fontWeight: 700, background: copiedKey === `prompt-${i}` ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)', border: `1px solid ${copiedKey === `prompt-${i}` ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.25)'}`, color: copiedKey === `prompt-${i}` ? '#10b981' : '#a5b4fc' }}
                        >{copiedKey === `prompt-${i}` ? '✓ Copied' : '📋 Copy'}</button>
                      </div>
                      <div style={{ padding: '10px 14px', fontSize: 12, color: '#94a3b8', lineHeight: 1.65 }}>{item.prompt}</div>
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

function InstallGuide({ tab, steps, copiedKey, onCopy }: {
  tab: Tab;
  steps: { title: string; steps: { heading: string; code?: string; note?: string }[] }[];
  copiedKey: string | null;
  onCopy: (key: string, code: string) => void;
}) {
  const meta: Record<string, { name: string; icon: string; color: string; tagline: string }> = {
    'claude-code': { name: 'Claude Code', icon: '🤖', color: '#6366f1', tagline: 'Anthropic\'s AI coding agent — CLI + VS Code + JetBrains' },
    copilot: { name: 'GitHub Copilot', icon: '✈️', color: '#2563eb', tagline: 'The most popular AI coding assistant — IDE extensions + CLI' },
    cursor: { name: 'Cursor IDE', icon: '🖱️', color: '#8b5cf6', tagline: 'AI-first IDE — a VS Code fork with built-in multi-file AI editing' },
    codeium: { name: 'Codeium / Windsurf', icon: '⚡', color: '#10b981', tagline: 'Free unlimited AI completions — plus Windsurf IDE with Cascade agent' },
    tabnine: { name: 'Tabnine', icon: '🔵', color: '#0ea5e9', tagline: 'Privacy-first AI — runs locally, trains on your team\'s codebase' },
  };
  const m = meta[tab] || { name: '', icon: '', color: '#6366f1', tagline: '' };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <span style={{ fontSize: 32 }}>{m.icon}</span>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#f1f5f9' }}>{m.name} — Installation Guide</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{m.tagline}</p>
          </div>
        </div>
      </div>
      {steps.map((section, si) => (
        <div key={si} style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 20px', background: `${m.color}0a`, borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 700, color: m.color }}>
            {section.title}
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {section.steps.map((step, i) => (
              <div key={i}>
                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: step.code ? 8 : 0, lineHeight: 1.6 }}>{step.heading}</div>
                {step.code && <CodeBlock codeKey={`${tab}-${si}-${i}`} code={step.code} copiedKey={copiedKey} onCopy={onCopy} />}
                {step.note && <div style={{ marginTop: 6, padding: '8px 12px', background: `${m.color}09`, border: `1px solid ${m.color}25`, borderRadius: 7, fontSize: 11, color: m.color }}>{step.note}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ codeKey, code, copiedKey, onCopy }: {
  codeKey: string; code: string; copiedKey: string | null; onCopy: (key: string, code: string) => void;
}) {
  return (
    <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => onCopy(codeKey, code)}
          style={{
            padding: '3px 10px', borderRadius: 5, fontSize: 10, cursor: 'pointer', fontWeight: 700,
            background: copiedKey === codeKey ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)',
            border: `1px solid ${copiedKey === codeKey ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.25)'}`,
            color: copiedKey === codeKey ? '#10b981' : '#a5b4fc',
          }}
        >{copiedKey === codeKey ? '✓ Copied!' : '📋 Copy'}</button>
      </div>
      <pre style={{ margin: 0, padding: '12px 16px', fontSize: 12, lineHeight: 1.7, color: '#a5b4fc', fontFamily: '"Fira Code", "Consolas", monospace', overflowX: 'auto', whiteSpace: 'pre' }}>{code}</pre>
    </div>
  );
}
