'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { getScenario } from '@/lib/capstone-scenarios';

const projects = [
  {
    id: 1, icon: '🛒', title: 'E-Commerce QA Engineer', level: 'Intermediate', color: '#10b981',
    description: 'Full QA ownership of a Shopify-like e-commerce platform. Test the entire shopping journey end-to-end across web and mobile.',
    skills: ['Manual Testing', 'API Testing', 'Playwright Automation', 'Performance Testing'],
    deliverables: ['Test Plan', '50+ Test Cases', 'Bug Report Suite', 'Playwright Automation', 'API Collection', 'Performance Report'],
    scenario: 'You join as the first QA on a growing e-commerce startup. The app processes $2M in orders monthly and has zero test coverage. The engineering team ships every day.',
    bugs: 12, duration: '8 hours', xpReward: 500,
    tasks: [
      'Review product requirements and create a risk matrix',
      'Write a formal Test Plan document (scope, resources, timeline)',
      'Design 50+ test cases for homepage, PDP, cart, and checkout',
      'Execute manual tests and document all defects in a bug report',
      'Write Playwright automation for the happy-path checkout flow',
      'Build a Postman collection for the Orders and Products APIs',
      'Run a k6 load test simulating 500 concurrent shoppers',
      'Present findings in a QA Summary Report',
    ],
    technologies: ['Playwright', 'Postman', 'k6', 'Jira', 'GitHub Actions'],
    realWorldContext: 'Modelled on actual QA setups at Shopify, WooCommerce, and Magento implementations.',
  },
  {
    id: 2, icon: '☁️', title: 'SaaS Platform QA', level: 'Advanced', color: '#6366f1',
    description: 'Multi-tenant B2B SaaS application with complex permission models, billing systems, and REST APIs used by 500 enterprise customers.',
    skills: ['API Testing', 'Security Testing', 'Cypress Automation', 'Database Testing'],
    deliverables: ['Risk Analysis', 'API Test Suite', 'Security Report', 'Automated Regression', 'DB Validation Scripts', 'Tenant Isolation Report'],
    scenario: 'A B2B SaaS with 500 enterprise customers is preparing for SOC 2 compliance. You must ensure complete data isolation between tenants and no privilege escalation.',
    bugs: 15, duration: '10 hours', xpReward: 650,
    tasks: [
      'Map all API endpoints and create a coverage matrix',
      'Write API tests for all CRUD operations across 3 tenant scenarios',
      'Test tenant isolation — verify tenant A cannot access tenant B data',
      'Execute OWASP Top 10 security testing checklist',
      'Test billing edge cases: trial expiry, plan upgrades, downgrades',
      'Write Cypress automation for the admin dashboard',
      'Validate database constraints and foreign key integrity',
      'Produce a SOC 2 testing evidence package',
    ],
    technologies: ['Cypress', 'Postman', 'OWASP ZAP', 'PostgreSQL', 'AWS'],
    realWorldContext: 'Mirrors QA challenges at companies like Salesforce, HubSpot, and Monday.com.',
  },
  {
    id: 3, icon: '🏥', title: 'Healthcare App QA', level: 'Advanced', color: '#ef4444',
    description: 'Patient management system with HIPAA compliance requirements and medical workflow criticality. Patient data integrity is non-negotiable.',
    skills: ['Compliance Testing', 'Security Testing', 'Accessibility', 'Manual Testing'],
    deliverables: ['HIPAA Compliance Report', 'Accessibility Audit', 'Security Assessment', 'Test Cases', 'Audit Trail Validation', 'Data Encryption Report'],
    scenario: 'A telehealth platform serving 50,000 patients needs QA certification before launch. Any data breach or medical inaccuracy could cause patient harm and legal liability.',
    bugs: 10, duration: '9 hours', xpReward: 600,
    tasks: [
      'Review HIPAA safeguards (Administrative, Physical, Technical)',
      'Test PHI data at rest and in transit encryption',
      'Validate role-based access: doctor vs. nurse vs. admin vs. patient',
      'Run accessibility audit against WCAG 2.1 AA using axe and manual testing',
      'Test audit trail logging for all PHI access events',
      'Validate medical calculation accuracy (dosage, BMI, dates)',
      'Test data retention and deletion procedures',
      'Produce a HIPAA compliance evidence document',
    ],
    technologies: ['axe-core', 'NVDA', 'Burp Suite', 'Selenium', 'SQL Server'],
    realWorldContext: 'Based on real QA requirements for Epic, Cerner, and telehealth platforms.',
  },
  {
    id: 4, icon: '💰', title: 'FinTech QA Engineer', level: 'Expert', color: '#f59e0b',
    description: 'Digital banking platform with payment processing, fraud detection, and PCI-DSS regulatory compliance. Any bug has direct financial impact.',
    skills: ['Security Testing', 'Performance Testing', 'API Testing', 'Compliance'],
    deliverables: ['PCI-DSS Assessment', 'Penetration Test Report', 'Load Test Results', 'Compliance Checklist', 'Regression Suite', 'Fraud Scenario Tests'],
    scenario: 'A neobank is processing $10M/day. Any payment defect, security breach, or performance failure has direct financial and reputational consequences.',
    bugs: 18, duration: '12 hours', xpReward: 800,
    tasks: [
      'Map payment flows: debit, credit, wire transfer, refund, reversal',
      'Test concurrent transactions for race conditions and double-spending',
      'Execute PCI-DSS compliance checklist (card data, encryption, access)',
      'Perform penetration testing: injection, auth bypass, privilege escalation',
      'Run a spike load test: 0 → 10,000 TPS in 60 seconds',
      'Test fraud detection: known fraud patterns, false positives',
      'Validate idempotency keys on payment endpoints',
      'Produce a PCI-DSS self-assessment questionnaire',
    ],
    technologies: ['Burp Suite', 'k6', 'Postman', 'Playwright', 'Metasploit (sandbox)'],
    realWorldContext: 'Mirrors QA requirements at Stripe, Revolut, Monzo, and traditional banks.',
  },
  {
    id: 5, icon: '🤖', title: 'AI Chatbot Testing', level: 'Expert', color: '#a855f7',
    description: 'Customer service AI chatbot for a major retailer. Test for hallucination, bias, prompt injection, toxicity, and accuracy at scale.',
    skills: ['LLM Testing', 'AI Security', 'Prompt Engineering', 'Red Teaming'],
    deliverables: ['AI Test Strategy', 'Jailbreak Report', 'Hallucination Analysis', 'Safety Assessment', 'Bias Report', 'Eval Framework'],
    scenario: 'An AI-powered customer service bot handles 10,000 queries/day. It must be accurate, safe, culturally sensitive, and resistant to adversarial manipulation.',
    bugs: 25, duration: '8 hours', xpReward: 750,
    tasks: [
      'Design an AI quality dimensions matrix (accuracy, safety, bias, latency)',
      'Create a golden dataset of 100 Q&A pairs with expected answers',
      'Test 20+ jailbreak and prompt injection patterns',
      'Run hallucination tests: ask about things the bot cannot know',
      'Bias audit: test across 5 demographic groups for response consistency',
      'Toxicity testing: probe for harmful content generation',
      'Performance test: 100 concurrent LLM calls, measure P95 latency',
      'Build an automated eval pipeline using LLM-as-judge',
    ],
    technologies: ['Python', 'RAGAS', 'LangSmith', 'Pytest', 'OpenAI Evals'],
    realWorldContext: 'Based on AI testing practices at OpenAI, Anthropic, Google DeepMind, and enterprise AI teams.',
  },
  {
    id: 6, icon: '📡', title: 'RAG System Validation', level: 'Expert', color: '#0ea5e9',
    description: 'Enterprise legal knowledge base using RAG architecture. Validate retrieval accuracy, citation quality, context faithfulness, and hallucination rates.',
    skills: ['RAG Testing', 'LLM Evaluation', 'Vector DB Testing', 'Data Quality'],
    deliverables: ['Retrieval Accuracy Report', 'Faithfulness Audit', 'Benchmark Results', 'Quality Dashboard', 'Chunk Strategy Analysis', 'Latency Report'],
    scenario: 'A law firm built a RAG system to answer questions from 50,000 contracts. A wrong answer could result in missed deadlines, financial penalties, or malpractice claims.',
    bugs: 20, duration: '9 hours', xpReward: 700,
    tasks: [
      'Understand the RAG pipeline: chunking strategy, embedding model, retrieval',
      'Build a test set of 50 questions with ground-truth answers from documents',
      'Measure retrieval recall: are the right chunks being retrieved?',
      'Measure faithfulness: does the answer contradict the retrieved context?',
      'Test edge cases: multi-document questions, conflicting sources',
      'Test retrieval with noisy/irrelevant documents injected',
      'Measure latency: retrieval time + generation time at percentiles',
      'Build a RAGAS-based automated evaluation dashboard',
    ],
    technologies: ['Python', 'RAGAS', 'Pinecone/Weaviate', 'LangChain', 'Jupyter'],
    realWorldContext: 'Directly applicable to AI legal tools (Harvey, Lexion), medical AI, and enterprise knowledge bases.',
  },
  {
    id: 7, icon: '🤝', title: 'Agentic AI Validation', level: 'Expert', color: '#14b8a6',
    description: 'Multi-agent system for software development assistance. Test agent planning, tool usage, memory, inter-agent communication, and failure recovery.',
    skills: ['Agentic AI Testing', 'LLM Testing', 'Tool Validation', 'Multi-Agent QA'],
    deliverables: ['Agent Behavior Report', 'Failure Mode Analysis', 'Tool Execution Tests', 'Orchestration Audit', 'Memory Consistency Report', 'Cost Analysis'],
    scenario: 'A multi-agent coding assistant can browse the web, write code, execute tests, and deploy. Any misuse of tool calls could affect production systems or leak data.',
    bugs: 22, duration: '10 hours', xpReward: 850,
    tasks: [
      'Map all agent tools: names, parameters, permissions, side effects',
      'Test tool call accuracy: does the agent use the right tool for each task?',
      'Test tool failure handling: what happens when a tool returns an error?',
      'Test inter-agent handoffs: does context transfer correctly between agents?',
      'Test agent memory: does it recall decisions from earlier in the session?',
      'Boundary testing: attempt to make agents take unauthorized actions',
      'Test infinite loop prevention and max-iteration guards',
      'Measure and audit token consumption and API cost per task',
    ],
    technologies: ['LangGraph', 'AutoGen', 'Python', 'Pytest', 'OpenTelemetry'],
    realWorldContext: 'Based on real testing challenges at companies building with Claude, GPT-4, and open-source agent frameworks.',
  },
  {
    id: 8, icon: '🔗', title: 'MCP Platform Testing', level: 'Expert', color: '#8b5cf6',
    description: 'Model Context Protocol server exposing 50 internal tools to AI agents. Test tool discovery, auth, routing, permission enforcement, and failure handling.',
    skills: ['MCP Testing', 'Protocol Testing', 'Security Testing', 'Integration Testing'],
    deliverables: ['MCP Conformance Report', 'Security Assessment', 'Tool Routing Tests', 'Permission Audit', 'Error Handling Report', 'Performance Benchmark'],
    scenario: 'An enterprise MCP server gives AI agents access to databases, APIs, and internal systems. Any permission bug or routing error could expose sensitive corporate data.',
    bugs: 16, duration: '7 hours', xpReward: 700,
    tasks: [
      'Validate MCP server conforms to the official Anthropic MCP specification',
      'Test tool discovery: all 50 tools returned with correct schemas',
      'Test each tool with valid inputs, invalid inputs, and edge cases',
      'Security: attempt privilege escalation between tool permissions',
      'Test authentication: valid tokens, expired tokens, revoked tokens',
      'Test rate limiting and quota enforcement per client',
      'Error handling: what does the server return on tool execution failure?',
      'Performance: measure tool discovery and call latency under load',
    ],
    technologies: ['MCP SDK', 'Python', 'Pytest', 'Postman', 'k6'],
    realWorldContext: 'Directly applicable as MCP becomes the standard for enterprise AI tool integration.',
  },
];

const levelColors: Record<string, string> = {
  'Beginner': '#10b981', 'Intermediate': '#6366f1', 'Advanced': '#f59e0b', 'Expert': '#ef4444',
};

export default function CapstonePage() {
  const { xp, addXP } = useStore();
  const [progress, setProgress] = useState<Record<number, Record<number, boolean>>>({});
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);
  const [filter, setFilter] = useState('All');

  const levels = ['All', 'Intermediate', 'Advanced', 'Expert'];

  const toggleTask = (projectId: number, taskIdx: number) => {
    setProgress(prev => {
      const proj = prev[projectId] || {};
      return { ...prev, [projectId]: { ...proj, [taskIdx]: !proj[taskIdx] } };
    });
  };

  const getProjectProgress = (projectId: number, totalTasks: number) => {
    const done = Object.values(progress[projectId] || {}).filter(Boolean).length;
    return { done, total: totalTasks, pct: Math.round((done / totalTasks) * 100) };
  };

  const filtered = filter === 'All' ? projects : projects.filter(p => p.level === filter);

  const totalBugs = projects.reduce((a, p) => a + p.bugs, 0);
  const totalHours = projects.reduce((a, p) => a + parseInt(p.duration), 0);
  const allTasksDone = projects.reduce((a, p) => {
    return a + Object.values(progress[p.id] || {}).filter(Boolean).length;
  }, 0);
  const allTasksTotal = projects.reduce((a, p) => a + p.tasks.length, 0);

  return (
    <AppShell>
      <div className="page-content fade-in-up">

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.08))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '28px 32px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 140, opacity: 0.04, pointerEvents: 'none' }}>🏆</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>🏆 Capstone Projects</h1>
          <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: 14, lineHeight: 1.6 }}>
            8 real-world QA projects from e-commerce to agentic AI. Complete projects to build a production-grade portfolio that gets you hired.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { icon: '📋', label: '8 Projects', value: '8', color: '#6366f1' },
              { icon: '🐛', label: 'Total Bugs', value: `${totalBugs}+`, color: '#ef4444' },
              { icon: '📄', label: 'Deliverables', value: '48+', color: '#10b981' },
              { icon: '⏱️', label: 'Study Hours', value: `${totalHours}h`, color: '#f59e0b' },
              { icon: '✅', label: 'Tasks Done', value: `${allTasksDone}/${allTasksTotal}`, color: '#a855f7' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {levels.map(l => (
            <button key={l} onClick={() => setFilter(l)} style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              background: filter === l ? (levelColors[l] || '#6366f1') : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter === l ? (levelColors[l] || '#6366f1') : 'rgba(255,255,255,0.1)'}`,
              color: filter === l ? '#fff' : '#94a3b8',
              transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>

        {/* ── Project Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {filtered.map(p => {
            const prog = getProjectProgress(p.id, p.tasks.length);
            const isSelected = selected?.id === p.id;
            return (
              <div key={p.id} style={{
                background: '#12121a',
                border: `1px solid ${isSelected ? p.color + '50' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 18, overflow: 'hidden', transition: 'all 0.2s',
                boxShadow: isSelected ? `0 0 0 2px ${p.color}30` : 'none',
              }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                <div style={{ padding: '20px 22px' }}>

                  {/* Header */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: `${p.color}20`, border: `1px solid ${p.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    }}>{p.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: `${levelColors[p.level] || p.color}20`, color: levelColors[p.level] || p.color }}>{p.level}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>⏱ {p.duration}</span>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(168,85,247,0.1)', color: '#c084fc' }}>✨ {p.xpReward} XP</span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>{p.title}</h3>
                    </div>
                  </div>

                  <p style={{ margin: '0 0 14px', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{p.description}</p>

                  {/* Scenario */}
                  <div style={{
                    padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 14,
                    fontSize: 11, color: '#64748b', lineHeight: 1.5,
                  }}>
                    <strong style={{ color: '#94a3b8' }}>📋 Scenario: </strong>{p.scenario}
                  </div>

                  {/* Progress bar */}
                  {prog.done > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 5 }}>
                        <span>Progress</span><span style={{ color: p.color }}>{prog.done}/{prog.total} tasks · {prog.pct}%</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${prog.pct}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}99)`, borderRadius: 3, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                    {p.skills.map(s => (
                      <span key={s} style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10, background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>{s}</span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 16, fontSize: 12, color: '#64748b' }}>
                    <span>🐛 {p.bugs} bugs</span>
                    <span>📋 {p.deliverables.length} deliverables</span>
                    <span>✅ {p.tasks.length} tasks</span>
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {getScenario(p.id) ? (
                      <Link
                        href={`/capstone/${p.id}`}
                        style={{
                          flex: 1, padding: '10px', textAlign: 'center',
                          background: `linear-gradient(135deg, ${p.color}25, ${p.color}15)`,
                          border: `1px solid ${p.color}50`, borderRadius: 8,
                          color: p.color, fontSize: 13, fontWeight: 700,
                          textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          transition: 'all 0.15s',
                        }}
                      >🧪 Launch Workspace</Link>
                    ) : (
                      <div style={{
                        flex: 1, padding: '10px', textAlign: 'center',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, color: '#475569', fontSize: 13, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>🔒 Workspace Coming Soon</div>
                    )}
                    <button
                      onClick={() => setSelected(isSelected ? null : p)}
                      style={{
                        flex: getScenario(p.id) ? 0 : 1,
                        padding: '10px 14px',
                        background: isSelected ? `${p.color}20` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isSelected ? p.color + '40' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8, color: isSelected ? p.color : '#64748b',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >{isSelected ? '▲' : '▼ Details'}</button>
                  </div>
                </div>

                {/* ── Expanded Task Tracker ── */}
                {isSelected && (
                  <div style={{ borderTop: `1px solid ${p.color}25`, padding: '20px 22px', background: `${p.color}06` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 14 }}>📝 Project Tasks</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {p.tasks.map((task, i) => {
                        const done = progress[p.id]?.[i] || false;
                        return (
                          <label key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
                            padding: '8px 10px', borderRadius: 8, transition: 'background 0.15s',
                            background: done ? `${p.color}12` : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${done ? p.color + '30' : 'rgba(255,255,255,0.05)'}`,
                          }}>
                            <input
                              type="checkbox" checked={done}
                              onChange={() => toggleTask(p.id, i)}
                              style={{ marginTop: 2, accentColor: p.color, width: 14, height: 14, flexShrink: 0, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: 12, color: done ? '#64748b' : '#94a3b8', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.5 }}>
                              {task}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Deliverables */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>📦 Deliverables</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {p.deliverables.map(d => (
                          <span key={d} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>{d}</span>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>🛠️ Technologies</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {p.technologies.map(t => (
                          <span key={t} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Real-world context */}
                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 4 }}>🌍 Real-World Context</div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{p.realWorldContext}</div>
                    </div>

                    {/* Complete button */}
                    {prog.pct === 100 && (
                      <button
                        onClick={() => { addXP(p.xpReward); alert(`🎉 Project complete! +${p.xpReward} XP earned!`); }}
                        style={{
                          width: '100%', padding: '12px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none', borderRadius: 8, color: '#fff',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        🏆 Claim Project Completion (+{p.xpReward} XP)
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Portfolio Tips ── */}
        <div style={{
          marginTop: 36, background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '24px 28px',
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>
            💡 Portfolio Tips from Senior QA Engineers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[
              { icon: '📁', tip: 'Host your test suites on GitHub with a clear README explaining what you tested and why.', color: '#6366f1' },
              { icon: '🎯', tip: 'Pick 2–3 projects that match your target role. Depth beats breadth every time.', color: '#10b981' },
              { icon: '🐛', tip: 'Document real bugs you find with steps to reproduce, expected vs actual, severity.', color: '#ef4444' },
              { icon: '📊', tip: 'Include test reports with metrics: coverage, pass rate, defects by severity.', color: '#f59e0b' },
              { icon: '🤖', tip: 'At least one AI testing project is now expected at product companies in 2025.', color: '#a855f7' },
              { icon: '🔗', tip: 'Link your portfolio projects directly in your LinkedIn and resume.', color: '#14b8a6' },
            ].map(({ icon, tip, color }) => (
              <div key={tip} style={{
                display: 'flex', gap: 12, padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
