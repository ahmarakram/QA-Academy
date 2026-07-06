'use client';

import { use, useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { modules } from '@/lib/modules';
import { getModuleContent } from '@/lib/module-content';
import { useStore } from '@/lib/store';
import { askOfflineAgent } from '@/lib/offline-agent';
import Link from 'next/link';

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const moduleId = parseInt(id);
  const mod = modules.find(m => m.id === moduleId);
  const content = getModuleContent(moduleId);
  const { moduleProgress, completeModule, addXP, level, visitModule, moduleNotes, setModuleNote, recordActivity } = useStore();
  const done = moduleProgress.some(p => p.moduleId === moduleId && p.completed);
  const [activeTab, setActiveTab] = useState<'learn' | 'labs' | 'quiz' | 'notes'>('learn');
  const [aiExplain, setAiExplain] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [noteText, setNoteText] = useState(moduleNotes[moduleId] ?? '');
  const [noteSaved, setNoteSaved] = useState(false);

  const prevMod = modules.find(m => m.id === moduleId - 1);
  const nextMod = modules.find(m => m.id === moduleId + 1);

  // Record visit + activity on mount
  useEffect(() => {
    visitModule(moduleId);
    recordActivity();
  }, [moduleId]);

  if (!mod) {
    return (
      <AppShell>
        <div style={{ padding: 40 }}>
          <h1 style={{ color: '#e2e8f0' }}>Module not found</h1>
          <Link href="/learning-path" style={{ color: '#6366f1' }}>← Back to Learning Path</Link>
        </div>
      </AppShell>
    );
  }

  const handleExplain = async () => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 200));
    const result = askOfflineAgent(mod.title, level);
    setAiExplain(result.text);
    setAiLoading(false);
  };

  const saveNote = () => {
    setModuleNote(moduleId, noteText);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <AppShell>
      <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#64748b' }}>
          <Link href="/learning-path" style={{ color: '#6366f1', textDecoration: 'none' }}>Learning Path</Link>
          <span>›</span>
          <span>Module {mod.id}</span>
        </div>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${mod.color}22, ${mod.color}08)`,
          border: `1px solid ${mod.color}33`,
          borderRadius: 20, padding: '28px 32px', marginBottom: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${mod.color}, transparent)` }} />
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16, flexShrink: 0,
              background: `${mod.color}22`, border: `1px solid ${mod.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              boxShadow: `0 8px 24px ${mod.color}33`,
            }}>{mod.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                Module {mod.id} · {mod.difficulty} · {mod.duration}
                {done && <span style={{ color: '#10b981', marginLeft: 12 }}>✓ Completed</span>}
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>{mod.title}</h1>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 14 }}>{mod.subtitle}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {mod.topics.map(t => (
                  <span key={t} style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11,
                    background: `${mod.color}15`, color: mod.color,
                    border: `1px solid ${mod.color}33`,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
          {(['learn', 'labs', 'quiz', 'notes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`filter-pill ${activeTab === tab ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              {tab === 'learn' ? '📖 Learn' : tab === 'labs' ? '🔬 Labs' : tab === 'quiz' ? '🎯 Quiz' : '📝 Notes'}
              {tab === 'notes' && moduleNotes[moduleId] && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 8, height: 8, borderRadius: '50%', background: '#10b981',
                  boxShadow: '0 0 6px rgba(16,185,129,0.8)',
                }} />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'learn' && (
          <div>
            {content?.overview && (
              <div style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '20px 24px', marginBottom: 20,
              }}>
                <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Overview</h2>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7, fontSize: 14 }}>{content.overview}</p>
              </div>
            )}

            {/* AI Tutor panel */}
            <div style={{
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 12, padding: '14px 18px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>AI Tutor</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>AI Tutor — instant explanation at your level ({level})</div>
              </div>
              <button
                onClick={handleExplain}
                disabled={aiLoading}
                className="btn-primary"
                style={{ fontSize: 12, padding: '7px 14px' }}
              >
                {aiLoading ? 'Loading…' : 'Explain for my level'}
              </button>
            </div>

            {aiExplain && (
              <div style={{
                background: '#12121a', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 14, padding: '20px 24px', marginBottom: 20,
              }}>
                <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600, marginBottom: 10 }}>🤖 AI Explanation</div>
                <div className="prose-qa" style={{ fontSize: 14 }}>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{aiExplain}</pre>
                </div>
              </div>
            )}

            {content?.keyConceptsHtml ? (
              <div style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '24px 28px', marginBottom: 20,
              }}>
                <div className="prose-qa" dangerouslySetInnerHTML={{ __html: content.keyConceptsHtml }} />
              </div>
            ) : (
              <div style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '24px 28px', marginBottom: 20,
              }}>
                <div className="prose-qa">
                  <h2>Topics Covered</h2>
                  <ul>{mod.topics.map(t => <li key={t}>{t}</li>)}</ul>
                  {mod.tools && (
                    <>
                      <h2>Tools & Technologies</h2>
                      <ul>{mod.tools.map(t => <li key={t}>{t}</li>)}</ul>
                    </>
                  )}
                  <p style={{ color: '#64748b', fontStyle: 'italic' }}>
                    Full interactive content is being loaded. Use the AI Tutor to explore any topic in this module.
                  </p>
                </div>
              </div>
            )}

            {content?.codeExample && (
              <div style={{
                background: '#0d0d18', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, overflow: 'hidden', marginBottom: 20,
              }}>
                <div style={{
                  padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: 10, background: '#12121a',
                }}>
                  <span style={{ fontSize: 14 }}>💻</span>
                  <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{content.codeExample.label}</span>
                  <span style={{
                    marginLeft: 'auto', padding: '2px 8px', borderRadius: 4, fontSize: 11,
                    background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                  }}>{content.codeExample.language}</span>
                </div>
                <pre style={{ margin: 0, padding: '20px', overflowX: 'auto', color: '#e2e8f0', fontSize: 13, lineHeight: 1.6 }}>
                  <code>{content.codeExample.code}</code>
                </pre>
              </div>
            )}

            {content?.diagrams && content.diagrams.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: '0 0 12px' }}>📊 Visual Assets</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {content.diagrams.map((d) => (
                    <div key={d.title} style={{
                      background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12, padding: '16px',
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>
                        {d.type === 'flow' ? '🔄' : d.type === 'architecture' ? '🏗️' : d.type === 'matrix' ? '📊' : d.type === 'tree' ? '🌳' : '📐'}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{d.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{d.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!done && (
              <button
                onClick={() => { completeModule(moduleId); addXP(50); recordActivity(); }}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', marginTop: 8, borderRadius: 12, fontSize: 14 }}
              >
                ✅ Mark Module as Complete (+150 XP)
              </button>
            )}
            {done && (
              <div style={{
                textAlign: 'center', padding: '14px', marginTop: 8,
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 12, color: '#10b981', fontSize: 14, fontWeight: 600,
              }}>
                ✅ Module Completed — great work!
              </div>
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#e2e8f0' }}>Practice Labs</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>Hands-on labs to apply your knowledge</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mod.labs.map((lab, i) => (
                <div key={i} style={{
                  background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `${mod.color}22`, border: `1px solid ${mod.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    {i + 1 <= 3 ? ['🔬', '🧪', '⚗️'][i] : '🔭'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{lab}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {i === 0 ? 'Beginner friendly' : i === 1 ? 'Intermediate challenge' : 'Advanced scenario'}
                    </div>
                  </div>
                  <Link
                    href={`/lab?module=${moduleId}&lab=${i}`}
                    style={{
                      padding: '8px 16px', background: `${mod.color}22`,
                      border: `1px solid ${mod.color}44`, borderRadius: 8,
                      color: mod.color, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                      transition: 'all 0.18s',
                    }}
                  >
                    Start Lab →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#e2e8f0' }}>Module Quiz</h2>
            <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
              Test your knowledge of {mod.title}
            </p>
            <Link
              href={`/quiz?module=${moduleId}`}
              className="btn-primary"
              style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}
            >
              Start Quiz →
            </Link>
          </div>
        )}

        {/* ── Enhancement 4: Module Notes ───────────────── */}
        {activeTab === 'notes' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#e2e8f0' }}>📝 Module Notes</h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>
                Your private scratchpad for {mod.title}. Notes are saved locally.
              </p>
            </div>
            <div style={{
              background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ fontSize: 13, color: '#475569' }}>📝 Notes for Module {moduleId}: {mod.title}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#334155' }}>
                  {noteText.length} chars
                </span>
              </div>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder={`Write your notes, key takeaways, questions, and reminders for ${mod.title}...\n\nTip: Use this to jot down:\n• Key concepts to remember\n• Questions to follow up on\n• Personal examples and analogies\n• Links to resources`}
                style={{
                  width: '100%', minHeight: 320, background: 'transparent',
                  border: 'none', padding: '20px 24px', color: '#e2e8f0',
                  fontSize: 14, lineHeight: 1.7, outline: 'none', resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{
                padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.02)',
              }}>
                <button
                  onClick={saveNote}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: 13 }}
                >
                  {noteSaved ? '✓ Saved!' : '💾 Save Notes'}
                </button>
                {noteText && (
                  <button
                    onClick={() => {
                      const blob = new Blob([`# Notes: ${mod.title}\n\n${noteText}`], { type: 'text/plain' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `module-${moduleId}-notes.txt`;
                      a.click();
                    }}
                    className="btn-secondary"
                    style={{ padding: '7px 16px', fontSize: 13 }}
                  >
                    ⬇ Export .txt
                  </button>
                )}
                {noteText && (
                  <button
                    onClick={() => { if (confirm('Clear all notes?')) setNoteText(''); }}
                    style={{
                      padding: '7px 14px', background: 'transparent',
                      border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                      color: '#f87171', fontSize: 12, cursor: 'pointer', marginLeft: 'auto',
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick note templates */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: '#334155', marginBottom: 8 }}>Quick Templates:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: '📌 Key Points', text: `## Key Points — ${mod.title}\n\n1. \n2. \n3. ` },
                  { label: '❓ Questions', text: `## Questions to Follow Up\n\n- ?\n- ?\n- ?` },
                  { label: '🔗 Resources', text: `## Useful Resources\n\n- \n- \n- ` },
                  { label: '💡 Summary', text: `## My Summary of ${mod.title}\n\nMain concept: \n\nWhen to use: \n\nPitfalls: ` },
                ].map(tmpl => (
                  <button
                    key={tmpl.label}
                    onClick={() => setNoteText(prev => prev ? prev + '\n\n' + tmpl.text : tmpl.text)}
                    style={{
                      padding: '5px 12px', fontSize: 11, cursor: 'pointer',
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: 20, color: '#a5b4fc', transition: 'all 0.15s',
                    }}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {prevMod ? (
            <Link href={`/module/${prevMod.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '10px 16px', background: '#12121a',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
                color: '#94a3b8', fontSize: 13, transition: 'all 0.18s',
              }}>
                ← {prevMod.icon} {prevMod.title}
              </div>
            </Link>
          ) : <div />}

          {nextMod && (
            <Link href={`/module/${nextMod.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #6366f133, #a855f733)',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10,
                color: '#a5b4fc', fontSize: 13, fontWeight: 600,
              }}>
                {nextMod.icon} {nextMod.title} →
              </div>
            </Link>
          )}
        </div>
      </div>
    </AppShell>
  );
}
