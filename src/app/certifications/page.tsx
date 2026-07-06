'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import {
  certifications, CERT_CATEGORIES, roadmaps,
  difficultyColor, categoryColor, resourceTypeIcon,
  type Certification, type CertCategory, type CertDifficulty,
} from '@/lib/certifications';
import { certRoutes } from '@/lib/cert-routes';
import ExamSimulator from '@/components/ExamSimulator';

const DIFF_ORDER: CertDifficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function CertificationsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDiff, setActiveDiff] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Certification | null>(null);
  const [tab, setTab] = useState<'overview' | 'topics' | 'resources' | 'tips' | 'routes'>('overview');
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<string | null>(null);
  const [examCert, setExamCert] = useState<string | null>(null);

  const filtered = certifications.filter(c => {
    if (activeCategory !== 'All' && c.category !== activeCategory) return false;
    if (activeDiff !== 'All' && c.difficulty !== activeDiff) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.shortName.toLowerCase().includes(search.toLowerCase()) &&
        !c.issuer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
    <AppShell>
      <div className="page-content" style={{ maxWidth: 1300 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>🏅</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>Certifications Hub</h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
                {certifications.length} certifications · QA, Automation, AI Testing & Cloud AI · with study materials & roadmaps
              </p>
            </div>
          </div>
        </div>

        {/* Roadmaps strip */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🗺️ Learning Roadmaps
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {roadmaps.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRoadmap(activeRoadmap === r.id ? null : r.id)}
                style={{
                  padding: '10px 16px', borderRadius: 12, cursor: 'pointer',
                  background: activeRoadmap === r.id ? `${r.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeRoadmap === r.id ? r.color + '66' : 'rgba(255,255,255,0.08)'}`,
                  color: activeRoadmap === r.id ? r.color : '#94a3b8',
                  fontSize: 13, fontWeight: 600, textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ marginRight: 6 }}>{r.icon}</span>{r.title}
              </button>
            ))}
          </div>

          {activeRoadmap && (() => {
            const r = roadmaps.find(x => x.id === activeRoadmap)!;
            const steps = r.steps.map(id => certifications.find(c => c.id === id)).filter(Boolean) as Certification[];
            return (
              <div style={{
                marginTop: 12, padding: '18px 20px',
                background: `${r.color}0d`, border: `1px solid ${r.color}33`,
                borderRadius: 14,
              }}>
                <div style={{ fontSize: 13, color: r.color, fontWeight: 700, marginBottom: 12 }}>
                  {r.icon} {r.title} — {r.description}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {steps.map((c, i) => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => { setSelected(c); setTab('overview'); }}
                        style={{
                          padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                          background: '#12121a', border: `1px solid ${r.color}44`,
                          color: '#e2e8f0', fontSize: 12, fontWeight: 600,
                        }}
                      >
                        <span style={{ marginRight: 4 }}>{c.issuerLogo}</span>
                        {c.shortName}
                        <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 4, fontSize: 10, background: `${difficultyColor[c.difficulty]}22`, color: difficultyColor[c.difficulty] }}>
                          {c.difficulty}
                        </span>
                      </button>
                      {i < steps.length - 1 && <span style={{ color: '#334155', fontSize: 18 }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* ── Left: filters + list ──────────────────── */}
          <div style={{ width: 320, flexShrink: 0 }}>

            {/* Search */}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search certifications…"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '9px 12px', color: '#e2e8f0', fontSize: 13,
                outline: 'none', marginBottom: 12, boxSizing: 'border-box',
              }}
            />

            {/* Category filter */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {['All', ...CERT_CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    padding: '4px 9px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: 'none',
                    background: activeCategory === cat
                      ? (cat === 'All' ? '#6366f1' : categoryColor[cat as CertCategory])
                      : 'rgba(255,255,255,0.06)',
                    color: activeCategory === cat ? '#fff' : '#64748b',
                    transition: 'all 0.15s',
                  }}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Difficulty</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {['All', ...DIFF_ORDER].map(d => (
                  <button key={d} onClick={() => setActiveDiff(d)} style={{
                    padding: '4px 9px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: 'none',
                    background: activeDiff === d
                      ? (d === 'All' ? '#6366f1' : difficultyColor[d as CertDifficulty])
                      : 'rgba(255,255,255,0.06)',
                    color: activeDiff === d ? '#fff' : '#64748b',
                  }}>{d}</button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#334155', marginBottom: 8 }}>{filtered.length} certifications</div>

            {/* Cert list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
              {filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelected(c); setTab('overview'); }}
                  style={{
                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    background: selected?.id === c.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected?.id === c.id ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{c.issuerLogo}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 5, marginBottom: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{
                          padding: '1px 7px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                          background: `${difficultyColor[c.difficulty]}22`, color: difficultyColor[c.difficulty],
                        }}>{c.difficulty}</span>
                        <span style={{
                          padding: '1px 7px', borderRadius: 4, fontSize: 9,
                          background: `${categoryColor[c.category]}18`, color: categoryColor[c.category],
                        }}>{c.category}</span>
                        {c.newBadge && <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 9, background: 'rgba(236,72,153,0.2)', color: '#f472b6' }}>NEW</span>}
                        {c.popular && <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 9, background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>⭐</span>}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.35 }}>{c.shortName}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.issuer}</div>
                      <div style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>
                        {c.cost.startsWith('Free') || c.cost === 'Free' ? (
                          <span style={{ color: '#10b981' }}>✓ Free</span>
                        ) : c.cost} · {c.duration}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: detail panel ───────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {!selected ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🏅</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>Select a Certification</h2>
                <p style={{ color: '#475569', fontSize: 14 }}>Browse {certifications.length} certifications with full study guides, exam topics, and resources.</p>

                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginTop: 28, maxWidth: 600, margin: '28px auto 0' }}>
                  {CERT_CATEGORIES.map(cat => {
                    const count = certifications.filter(c => c.category === cat).length;
                    return (
                      <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                        padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                        background: `${categoryColor[cat]}0d`, border: `1px solid ${categoryColor[cat]}33`,
                        color: categoryColor[cat], textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>{count}</div>
                        <div style={{ fontSize: 10, marginTop: 3, opacity: 0.8 }}>{cat}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                {/* Cert header */}
                <div style={{
                  background: `linear-gradient(135deg, ${categoryColor[selected.category]}15, ${categoryColor[selected.category]}08)`,
                  border: `1px solid ${categoryColor[selected.category]}30`,
                  borderRadius: 16, padding: '22px 26px', marginBottom: 18,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <span style={{ fontSize: 36, flexShrink: 0 }}>{selected.issuerLogo}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: `${difficultyColor[selected.difficulty]}22`, color: difficultyColor[selected.difficulty],
                        }}>{selected.difficulty}</span>
                        <span style={{
                          padding: '3px 10px', borderRadius: 6, fontSize: 11,
                          background: `${categoryColor[selected.category]}18`, color: categoryColor[selected.category],
                        }}>{selected.category}</span>
                        {selected.newBadge && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(236,72,153,0.2)', color: '#f472b6' }}>NEW</span>}
                        {selected.popular && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>⭐ Popular</span>}
                      </div>
                      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>{selected.name}</h2>
                      <div style={{ fontSize: 13, color: '#64748b' }}>by {selected.issuer}</div>
                    </div>
                  </div>

                  {/* Key stats bar */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: 10, marginTop: 18,
                  }}>
                    {[
                      { icon: '💰', label: 'Cost', value: selected.cost.length > 25 ? selected.cost.split('(')[0].trim() : selected.cost },
                      { icon: '⏱️', label: 'Study Time', value: selected.duration },
                      { icon: '✅', label: 'Pass Mark', value: selected.passMark },
                      { icon: '🔄', label: 'Validity', value: selected.validity },
                      { icon: '📝', label: 'Format', value: selected.questions },
                    ].map(s => (
                      <div key={s.label} style={{
                        padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8,
                      }}>
                        <div style={{ fontSize: 10, color: '#475569', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.icon} {s.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam button */}
                <button
                  onClick={() => setExamCert(selected.name)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '11px', marginBottom: 14, fontSize: 13, borderRadius: 10 }}
                >
                  🎓 Take Certification Exam (50 MCQ · 90 min · Get Certificate)
                </button>

                {/* Tab nav */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 0 }}>
                  {(['overview', 'topics', 'resources', 'tips', 'routes'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                      padding: '8px 16px', borderRadius: '8px 8px 0 0', cursor: 'pointer', border: 'none',
                      background: tab === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                      borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
                      color: tab === t ? '#a5b4fc' : '#64748b', fontSize: 13, fontWeight: tab === t ? 600 : 400,
                      textTransform: 'capitalize',
                    }}>{t}</button>
                  ))}
                </div>

                {/* Tab content */}
                {tab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Description */}
                    <Section title="About this Certification">
                      <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.8 }}>{selected.description}</p>
                    </Section>

                    {/* Why + Career in 2 cols */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Section title="💡 Why Get It">
                        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{selected.whyGetIt}</p>
                      </Section>
                      <Section title="📈 Career Impact">
                        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{selected.careerImpact}</p>
                      </Section>
                    </div>

                    {/* Prerequisites */}
                    {selected.prerequisites.length > 0 && (
                      <Section title="📋 Prerequisites">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {selected.prerequisites.map((p, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                              <span style={{ color: '#f59e0b', flexShrink: 0 }}>⚠️</span>{p}
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}
                    {selected.prerequisites.length === 0 && (
                      <Section title="📋 Prerequisites">
                        <div style={{ fontSize: 13, color: '#10b981' }}>✓ No formal prerequisites — open to all</div>
                      </Section>
                    )}

                    {/* Exam details */}
                    <Section title="📝 Exam Details">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                        {[
                          ['Format', selected.format],
                          ['Questions', selected.questions],
                          ['Pass Mark', selected.passMark],
                          ['Validity', selected.validity],
                          ['Cost', selected.cost],
                        ].map(([k, v]) => (
                          <div key={k} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: 10, color: '#475569', marginBottom: 2, textTransform: 'uppercase' }}>{k}</div>
                            <div style={{ color: '#e2e8f0' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Languages */}
                    <Section title="🌍 Available Languages">
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {selected.languages.map(l => (
                          <span key={l} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>{l}</span>
                        ))}
                      </div>
                    </Section>

                    {/* Country recognition */}
                    <Section title="🗺️ Recognised In">
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {selected.countryRecognition.map(c => (
                          <span key={c} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, background: 'rgba(99,102,241,0.1)', color: '#a5b4fc' }}>{c}</span>
                        ))}
                      </div>
                    </Section>

                  </div>
                )}

                {tab === 'topics' && (
                  <div>
                    <Section title="📊 Exam Topic Breakdown">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selected.examTopics.map((t, i) => {
                          const pct = parseInt(t.weight);
                          return (
                            <div key={i}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, color: '#e2e8f0' }}>{t.name}</span>
                                <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 700 }}>{t.weight}</span>
                              </div>
                              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%', width: `${pct}%`,
                                  background: `linear-gradient(90deg, ${categoryColor[selected.category]}, ${categoryColor[selected.category]}88)`,
                                  borderRadius: 3,
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Section>
                  </div>
                )}

                {tab === 'resources' && (
                  <div>
                    <Section title="📚 Study Resources">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {selected.studyResources.map((r, i) => (
                          <div key={i} style={{
                            padding: '14px 16px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                          }}>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{resourceTypeIcon[r.type]}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{r.title}</span>
                                <span style={{
                                  padding: '1px 7px', borderRadius: 4, fontSize: 10,
                                  background: r.free ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                  color: r.free ? '#10b981' : '#f59e0b',
                                }}>{r.free ? 'Free' : 'Paid'}</span>
                                <span style={{
                                  padding: '1px 7px', borderRadius: 4, fontSize: 10,
                                  background: 'rgba(255,255,255,0.05)', color: '#64748b',
                                }}>{r.type}</span>
                              </div>
                              {r.note && <div style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>💡 {r.note}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>
                  </div>
                )}

                {tab === 'tips' && (
                  <div>
                    <Section title="🎯 Exam Tips & Strategy">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selected.tips.map((tip, i) => (
                          <div key={i} style={{
                            display: 'flex', gap: 12, padding: '12px 14px',
                            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                            borderRadius: 10,
                          }}>
                            <span style={{ color: '#6366f1', fontWeight: 800, flexShrink: 0, fontSize: 14 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {selected.relatedCerts.length > 0 && (
                      <Section title="🔗 Related Certifications" style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {selected.relatedCerts.map(id => {
                            const cert = certifications.find(c => c.id === id);
                            if (!cert) return null;
                            return (
                              <button key={id} onClick={() => { setSelected(cert); setTab('overview'); }} style={{
                                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8', fontSize: 12,
                              }}>
                                {cert.issuerLogo} {cert.shortName}
                              </button>
                            );
                          })}
                        </div>
                      </Section>
                    )}
                  </div>
                )}

                {/* Routes tab */}
                {tab === 'routes' && (() => {
                  const relevantRoutes = certRoutes.filter(r =>
                    r.steps.some(s => s.certId === selected.id)
                  );
                  const allRoutesForDisplay = relevantRoutes.length > 0 ? relevantRoutes : certRoutes.slice(0, 4);
                  return (
                    <div>
                      {relevantRoutes.length > 0 ? (
                        <div style={{
                          padding: '10px 14px', marginBottom: 16, borderRadius: 10,
                          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                          fontSize: 12, color: '#10b981',
                        }}>
                          ✅ This certification appears in {relevantRoutes.length} career route{relevantRoutes.length > 1 ? 's' : ''} below.
                        </div>
                      ) : (
                        <div style={{
                          padding: '10px 14px', marginBottom: 16, borderRadius: 10,
                          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                          fontSize: 12, color: '#a5b4fc',
                        }}>
                          💡 Showing popular routes. Add {selected.shortName} to your path after completing these routes.
                        </div>
                      )}
                      {allRoutesForDisplay.map(route => (
                        <div key={route.id} style={{
                          marginBottom: 12, border: `1px solid ${expandedRoute === route.id ? route.color + '55' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 14, overflow: 'hidden',
                          background: expandedRoute === route.id ? `${route.color}0a` : '#12121a',
                        }}>
                          <button
                            onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                            style={{
                              width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
                              cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                            }}
                          >
                            <span style={{ fontSize: 22, flexShrink: 0 }}>{route.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: route.color }}>{route.title}</div>
                              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{route.subtitle}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                                💰 {route.totalCost}
                              </span>
                              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                                ⏱ {route.totalTime}
                              </span>
                            </div>
                            <span style={{ color: '#64748b', fontSize: 14 }}>{expandedRoute === route.id ? '▲' : '▼'}</span>
                          </button>

                          {expandedRoute === route.id && (
                            <div style={{ padding: '0 16px 16px' }}>
                              <div style={{ marginBottom: 12, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{route.summary}</div>

                              <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                                  🎯 {route.targetRole}
                                </span>
                                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                  💰 {route.salaryRange}
                                </span>
                              </div>

                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>High demand in:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {route.countriesHighDemand.map(c => (
                                    <span key={c} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>{c}</span>
                                  ))}
                                </div>
                              </div>

                              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>Step-by-step path:</div>
                              {route.steps.map((step, i) => (
                                <div key={step.certId} style={{
                                  display: 'flex', gap: 10, marginBottom: 6,
                                  padding: '10px 12px', borderRadius: 10,
                                  background: step.certId === selected.id ? `${route.color}18` : 'rgba(255,255,255,0.03)',
                                  border: `1px solid ${step.certId === selected.id ? route.color + '44' : 'rgba(255,255,255,0.06)'}`,
                                }}>
                                  <div style={{
                                    flexShrink: 0, width: 24, height: 24, borderRadius: 6,
                                    background: route.color + '22', color: route.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700,
                                  }}>{i + 1}</div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>
                                      {step.icon} {step.certName}
                                      {step.certId === selected.id && (
                                        <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px', borderRadius: 6, background: route.color + '22', color: route.color }}>← You&apos;re here</span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, fontSize: 10, color: '#64748b' }}>
                                      <span>⏱ {step.duration}</span>
                                      <span>💰 {step.cost}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>{step.why}</div>
                                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                      {step.unlocks.map(u => (
                                        <span key={u} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                                          🔓 {u}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
    {examCert && <ExamSimulator certName={examCert} onClose={() => setExamCert(null)} />}
    </>
  );
}

function Section({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '16px 20px', ...style,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </div>
      {children}
    </div>
  );
}
