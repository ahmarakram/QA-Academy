'use client';

import { useState, use } from 'react';
import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { getScenario, Bug } from '@/lib/capstone-scenarios';
import { EcommerceApp } from '@/components/capstone-apps/EcommerceApp';
import { ChatbotApp } from '@/components/capstone-apps/ChatbotApp';
import { SaasApp } from '@/components/capstone-apps/SaasApp';

interface FiledBug {
  id: string;
  title: string;
  severity: string;
  steps: string;
  expected: string;
  actual: string;
  area: string;
  timestamp: string;
  matched?: string; // id of matched hidden bug
}

const tabs = ['📋 Brief', '🧪 Test App', '🐛 Bug Tracker', '✅ Test Cases', '📊 Report'] as const;
type Tab = typeof tabs[number];

const severityColors: Record<string, string> = {
  Critical: '#ef4444', High: '#f59e0b', Medium: '#6366f1', Low: '#10b981',
};

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = parseInt(id);
  const scenario = getScenario(projectId);

  const [activeTab, setActiveTab] = useState<Tab>('📋 Brief');
  const [filedBugs, setFiledBugs] = useState<FiledBug[]>([]);
  const [checkedTests, setCheckedTests] = useState<Record<string, boolean>>({});
  const [showBugForm, setShowBugForm] = useState(false);
  const [foundBugIds, setFoundBugIds] = useState<Set<string>>(new Set());
  const [newBug, setNewBug] = useState({ title: '', severity: 'High', steps: '', expected: '', actual: '', area: '' });

  if (!scenario) {
    return (
      <AppShell>
        <div className="page-content" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
          <h2 style={{ color: '#e2e8f0', marginBottom: 8 }}>Project workspace coming soon</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>This project simulation is being built. Check back soon!</p>
          <Link href="/capstone" style={{ color: '#a5b4fc', fontSize: 14 }}>← Back to Capstone Projects</Link>
        </div>
      </AppShell>
    );
  }

  const fileBug = () => {
    if (!newBug.title.trim()) return;
    // Try to match against hidden bugs
    const matched = scenario.hiddenBugs.find(hb =>
      !foundBugIds.has(hb.id) &&
      (hb.area.toLowerCase() === newBug.area.toLowerCase() ||
       newBug.title.toLowerCase().includes(hb.area.toLowerCase()) ||
       hb.title.toLowerCase().split(' ').some(w => w.length > 4 && newBug.title.toLowerCase().includes(w)))
    );
    const bug: FiledBug = {
      ...newBug,
      id: `BUG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      matched: matched?.id,
    };
    setFiledBugs(prev => [bug, ...prev]);
    if (matched) setFoundBugIds(prev => new Set([...prev, matched.id]));
    setNewBug({ title: '', severity: 'High', steps: '', expected: '', actual: '', area: '' });
    setShowBugForm(false);
    setActiveTab('🐛 Bug Tracker');
  };

  const onBugFound = (bugId: string) => {
    const bug = scenario.hiddenBugs.find(b => b.id === bugId);
    if (!bug || foundBugIds.has(bugId)) return;
    setFoundBugIds(prev => new Set([...prev, bugId]));
    const filed: FiledBug = {
      id: `BUG-${Date.now()}`,
      title: bug.title,
      severity: bug.severity,
      steps: bug.steps,
      expected: bug.expected,
      actual: bug.actual,
      area: bug.area,
      timestamp: new Date().toLocaleTimeString(),
      matched: bugId,
    };
    setFiledBugs(prev => [filed, ...prev]);
  };

  const bugScore = foundBugIds.size;
  const totalBugs = scenario.hiddenBugs.length;
  const testScore = Object.values(checkedTests).filter(Boolean).length;
  const totalTests = scenario.suggestedTestCases.length;
  const completionPct = Math.round(((bugScore / totalBugs) * 60 + (testScore / totalTests) * 40));

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Top bar ── */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          background: '#0d0d14', flexShrink: 0,
        }}>
          <Link href="/capstone" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            ← Projects
          </Link>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
              Project #{projectId} Workspace
            </div>
          </div>
          {/* Score badges */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <span style={{ fontSize: 12 }}>🐛</span>
              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{bugScore}/{totalBugs} bugs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <span style={{ fontSize: 12 }}>✅</span>
              <span style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600 }}>{testScore}/{totalTests} tests</span>
            </div>
            <div style={{
              padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: completionPct >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.12)',
              border: `1px solid ${completionPct >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.25)'}`,
              color: completionPct >= 80 ? '#10b981' : '#f59e0b',
            }}>{completionPct}% complete</div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: '#0d0d14', flexShrink: 0, overflowX: 'auto',
        }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                color: activeTab === tab ? '#a5b4fc' : '#475569',
                borderBottom: `2px solid ${activeTab === tab ? '#6366f1' : 'transparent'}`,
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >{tab}</button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* BRIEF */}
          {activeTab === '📋 Brief' && (
            <div style={{ padding: '28px 32px', maxWidth: 800 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#f1f5f9' }}>Project Brief</h2>
              <div style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '20px 24px', marginBottom: 24,
                fontSize: 13, color: '#94a3b8', lineHeight: 1.8, whiteSpace: 'pre-line',
              }}>{scenario.brief}</div>

              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#e2e8f0' }}>✅ Acceptance Criteria</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {scenario.acceptanceCriteria.map((ac, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, padding: '10px 14px',
                    background: '#12121a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
                  }}>
                    <span style={{ color: '#6366f1', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>AC-{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{ac}</span>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '16px 20px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12,
                fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
              }}>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>💡 How to use this workspace: </span>
                Click <strong style={{ color: '#e2e8f0' }}>🧪 Test App</strong> to explore the simulated application and find hidden bugs.
                When you spot a bug, click <strong style={{ color: '#e2e8f0' }}>Report Bug</strong> in the app or switch to the Bug Tracker tab.
                Check off test cases as you execute them. Your score updates in real-time.
              </div>
            </div>
          )}

          {/* TEST APP */}
          {activeTab === '🧪 Test App' && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#f1f5f9' }}>🧪 Simulated Application</h2>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                    Explore the app below. Find all {totalBugs} hidden bugs and report them. Hints are available if you get stuck.
                  </p>
                </div>
                <button
                  onClick={() => { setShowBugForm(true); setActiveTab('🐛 Bug Tracker'); }}
                  style={{
                    padding: '8px 18px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >🐛 Report a Bug</button>
              </div>

              {/* Bug progress bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 5 }}>
                  <span>Bugs Discovered</span><span style={{ color: '#ef4444' }}>{bugScore}/{totalBugs}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${(bugScore / totalBugs) * 100}%`, background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
              </div>

              {/* Render the correct app */}
              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', background: '#0a0a12' }}>
                {scenario.appType === 'ecommerce' && (
                  <EcommerceApp hiddenBugs={scenario.hiddenBugs} foundBugIds={foundBugIds} onBugFound={onBugFound} />
                )}
                {scenario.appType === 'ai-chatbot' && (
                  <ChatbotApp hiddenBugs={scenario.hiddenBugs} foundBugIds={foundBugIds} onBugFound={onBugFound} />
                )}
                {scenario.appType === 'saas' && (
                  <SaasApp hiddenBugs={scenario.hiddenBugs} foundBugIds={foundBugIds} onBugFound={onBugFound} />
                )}
                {!['ecommerce', 'ai-chatbot', 'saas'].includes(scenario.appType) && (
                  <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
                    <div style={{ fontSize: 15, color: '#64748b' }}>This app simulation is in development.</div>
                    <div style={{ fontSize: 13, marginTop: 8 }}>Use the Bug Tracker to manually file bugs from the acceptance criteria.</div>
                  </div>
                )}
              </div>

              {/* Hints panel */}
              <HintsPanel bugs={scenario.hiddenBugs} foundBugIds={foundBugIds} />
            </div>
          )}

          {/* BUG TRACKER */}
          {activeTab === '🐛 Bug Tracker' && (
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#f1f5f9' }}>🐛 Bug Tracker</h2>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{filedBugs.length} bugs filed · {bugScore} matched to real issues</p>
                </div>
                <button
                  onClick={() => setShowBugForm(!showBugForm)}
                  style={{
                    padding: '9px 18px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >{showBugForm ? '✕ Cancel' : '+ File New Bug'}</button>
              </div>

              {/* Bug form */}
              {showBugForm && (
                <div style={{
                  background: '#12121a', border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 14, padding: '20px 24px', marginBottom: 20,
                }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>📝 File a Bug Report</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Bug Title *</label>
                      <input value={newBug.title} onChange={e => setNewBug(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Negative quantity accepted in cart"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Severity</label>
                      <select value={newBug.severity} onChange={e => setNewBug(p => ({ ...p, severity: e.target.value }))} style={inputStyle}>
                        {['Critical', 'High', 'Medium', 'Low'].map(s => <option key={s} value={s} style={{ background: '#1a1a26' }}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Area / Component</label>
                      <input value={newBug.area} onChange={e => setNewBug(p => ({ ...p, area: e.target.value }))}
                        placeholder="e.g. Cart, Checkout, Auth"
                        style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Steps to Reproduce</label>
                      <textarea value={newBug.steps} onChange={e => setNewBug(p => ({ ...p, steps: e.target.value }))}
                        placeholder="1. Do this&#10;2. Then this&#10;3. Observe result"
                        rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Expected Result</label>
                      <textarea value={newBug.expected} onChange={e => setNewBug(p => ({ ...p, expected: e.target.value }))}
                        placeholder="What should happen?" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Actual Result</label>
                      <textarea value={newBug.actual} onChange={e => setNewBug(p => ({ ...p, actual: e.target.value }))}
                        placeholder="What actually happened?" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                  </div>
                  <button onClick={fileBug} style={{
                    padding: '10px 24px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                    borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>Submit Bug Report</button>
                </div>
              )}

              {/* Filed bugs list */}
              {filedBugs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#334155' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🐛</div>
                  <div style={{ fontSize: 14, color: '#475569' }}>No bugs filed yet. Go explore the Test App!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filedBugs.map(bug => (
                    <BugCard key={bug.id} bug={bug} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TEST CASES */}
          {activeTab === '✅ Test Cases' && (
            <div style={{ padding: '28px 32px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: '#f1f5f9' }}>✅ Test Case Execution</h2>
              <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: 13 }}>
                Check off each test case as you execute it in the Test App. {testScore}/{totalTests} executed.
              </p>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginBottom: 20 }}>
                <div style={{ height: '100%', width: `${(testScore / totalTests) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scenario.suggestedTestCases.map(tc => {
                  const done = checkedTests[tc.id];
                  return (
                    <label key={tc.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                      padding: '12px 16px', borderRadius: 10,
                      background: done ? 'rgba(16,185,129,0.06)' : '#12121a',
                      border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.18s',
                    }}>
                      <input type="checkbox" checked={!!done}
                        onChange={() => setCheckedTests(p => ({ ...p, [tc.id]: !p[tc.id] }))}
                        style={{ marginTop: 2, accentColor: '#10b981', width: 15, height: 15, flexShrink: 0, cursor: 'pointer' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '1px 7px', borderRadius: 4 }}>{tc.id.toUpperCase()}</span>
                          <span style={{
                            fontSize: 10, padding: '1px 7px', borderRadius: 4, fontWeight: 600,
                            background: tc.type === 'positive' ? 'rgba(16,185,129,0.1)' : tc.type === 'negative' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                            color: tc.type === 'positive' ? '#10b981' : tc.type === 'negative' ? '#ef4444' : '#f59e0b',
                          }}>{tc.type}</span>
                          <span style={{ fontSize: 10, color: '#475569' }}>{tc.area}</span>
                        </div>
                        <span style={{ fontSize: 13, color: done ? '#64748b' : '#e2e8f0', textDecoration: done ? 'line-through' : 'none' }}>
                          {tc.title}
                        </span>
                      </div>
                      {done && <span style={{ color: '#10b981', fontSize: 16, flexShrink: 0 }}>✓</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* REPORT */}
          {activeTab === '📊 Report' && (
            <div style={{ padding: '28px 32px', maxWidth: 750 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 20px', color: '#f1f5f9' }}>📊 Test Summary Report</h2>

              {/* Score card */}
              <div style={{
                background: `linear-gradient(135deg, ${completionPct >= 80 ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)'}, rgba(168,85,247,0.06))`,
                border: `1px solid ${completionPct >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.25)'}`,
                borderRadius: 16, padding: '24px', marginBottom: 24, textAlign: 'center',
              }}>
                <div style={{ fontSize: 52, fontWeight: 900, color: completionPct >= 80 ? '#10b981' : '#a5b4fc' }}>{completionPct}%</div>
                <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 4 }}>
                  {completionPct >= 80 ? '🎉 Excellent work!' : completionPct >= 50 ? '⚡ Good progress — keep going!' : '🔍 Keep exploring the app'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{bugScore}/{totalBugs}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Bugs Found</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#6366f1' }}>{testScore}/{totalTests}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Tests Executed</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>{filedBugs.length}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Bug Reports Filed</div>
                  </div>
                </div>
              </div>

              {/* Bugs found vs missed */}
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#e2e8f0' }}>Bug Discovery Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {scenario.hiddenBugs.map(bug => {
                  const found = foundBugIds.has(bug.id);
                  return (
                    <div key={bug.id} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px',
                      background: found ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)',
                      border: `1px solid ${found ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
                      borderRadius: 10,
                    }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{found ? '✅' : '❌'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: found ? '#10b981' : '#94a3b8' }}>{bug.title}</span>
                          <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 4, background: `${severityColors[bug.severity]}20`, color: severityColors[bug.severity] }}>{bug.severity}</span>
                        </div>
                        {!found && (
                          <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>{bug.hint}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {completionPct >= 60 && (
                <div style={{
                  padding: '16px 20px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12,
                  fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
                }}>
                  <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: 6 }}>🎓 Next Steps</div>
                  Host your bug reports on GitHub as a real portfolio piece. Document your test cases in a Google Sheet or Confluence page. This is exactly the kind of work senior QA engineers show in interviews.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function BugCard({ bug }: { bug: FiledBug }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: '#12121a', border: `1px solid ${bug.matched ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, flexShrink: 0,
          background: `${severityColors[bug.severity] || '#6366f1'}20`,
          color: severityColors[bug.severity] || '#a5b4fc',
        }}>{bug.severity}</span>
        <span style={{ fontSize: 13, color: '#e2e8f0', flex: 1 }}>{bug.title}</span>
        {bug.matched && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600, flexShrink: 0 }}>✓ Matched</span>}
        <span style={{ color: '#475569', fontSize: 11, flexShrink: 0 }}>{bug.timestamp}</span>
        <span style={{ color: '#475569', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            {bug.steps && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={fieldLabel}>Steps to Reproduce</div>
                <pre style={{ margin: 0, fontSize: 12, color: '#94a3b8', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.6 }}>{bug.steps}</pre>
              </div>
            )}
            {bug.expected && <div><div style={fieldLabel}>Expected</div><p style={fieldText}>{bug.expected}</p></div>}
            {bug.actual && <div><div style={fieldLabel}>Actual</div><p style={fieldText}>{bug.actual}</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}

function HintsPanel({ bugs, foundBugIds }: { bugs: Bug[]; foundBugIds: Set<string> }) {
  const [open, setOpen] = useState(false);
  const remaining = bugs.filter(b => !foundBugIds.has(b.id));
  if (remaining.length === 0) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 8, padding: '8px 16px', color: '#f59e0b', fontSize: 12, fontWeight: 600, cursor: 'pointer',
      }}>💡 {open ? 'Hide' : 'Show'} Hints ({remaining.length} bugs remaining)</button>
      {open && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {remaining.map((bug, i) => (
            <div key={bug.id} style={{
              padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8,
              display: 'flex', gap: 10,
            }}>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>#{i + 1}</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{bug.hint}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5, fontWeight: 500 };
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  padding: '9px 12px', color: '#e2e8f0', fontSize: 13, outline: 'none',
};
const fieldLabel: React.CSSProperties = { fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 };
const fieldText: React.CSSProperties = { margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 };
