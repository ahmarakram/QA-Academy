'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';
import { GROQ_MODELS, callGroq } from '@/lib/groq';

// ── API Key Help Tooltip ──────────────────────────────────────
const providers = [
  {
    id: 'groq',
    name: 'Groq',
    badge: 'FREE',
    badgeColor: '#10b981',
    icon: '⚡',
    tagline: 'Fastest inference — 14,400 free requests/day',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b'],
    keyPrefix: 'gsk_',
    steps: [
      'Go to console.groq.com and sign up (free, no credit card)',
      'Click "API Keys" in the left sidebar',
      'Click "Create API Key" → give it a name → copy it',
      'Paste the key (starts with gsk_) in the field above',
      'Click Test → then Save',
    ],
    note: 'Groq runs open-source LLMs at GPT-4 speed on custom hardware. Perfect for this academy.',
    color: '#f97316',
  },
  {
    id: 'openai',
    name: 'OpenAI / GPT',
    badge: 'PAID',
    badgeColor: '#f59e0b',
    icon: '🤖',
    tagline: 'GPT-4o, GPT-4 Turbo, GPT-3.5 — industry standard',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    keyPrefix: 'sk-',
    steps: [
      'Go to platform.openai.com and sign up',
      'Add a payment method (billing → credit card)',
      'Go to platform.openai.com/api-keys',
      'Click "Create new secret key" → name it → copy immediately',
      'Key starts with sk- and is shown only once — save it now',
      'Add the key in the AI Tutor settings or your .env file',
    ],
    note: 'GPT-4o-mini costs ~$0.00015 per 1K tokens — a full conversation is less than $0.001.',
    color: '#10b981',
  },
  {
    id: 'anthropic',
    name: 'Anthropic / Claude',
    badge: 'PAID',
    badgeColor: '#f59e0b',
    icon: '🧠',
    tagline: 'Claude Sonnet 4.6, Opus, Haiku — best for reasoning',
    models: ['claude-sonnet-4-6', 'claude-opus-4-8', 'claude-haiku-4-5'],
    keyPrefix: 'sk-ant-',
    steps: [
      'Go to console.anthropic.com and sign up',
      'Add a payment method under Billing',
      'Go to console.anthropic.com/settings/keys',
      'Click "Create Key" → name it → copy it immediately',
      'Key starts with sk-ant- and is shown only once',
      'Use it in your code: new Anthropic({ apiKey: "sk-ant-..." })',
    ],
    note: 'Claude Haiku is extremely cheap ($0.00025/1K input tokens). Claude Sonnet is used in all module code examples.',
    color: '#8b5cf6',
  },
];

function ApiKeyTooltip() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('groq');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const active = providers.find(p => p.id === activeTab)!;

  // Close on click-outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Help button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="How to get an API key"
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{
          width: 22, height: 22, borderRadius: '50%',
          background: open ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.4)',
          color: '#a5b4fc', fontSize: 12, fontWeight: 700,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s', flexShrink: 0,
        }}
      >?</button>

      {/* Backdrop + centered modal */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 499, background: 'rgba(0,0,0,0.5)' }}
          />
          <div
            role="dialog"
            aria-label="How to add an API key"
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 500,
              width: 'min(460px, calc(100vw - 32px))', background: '#0f0f1a',
              border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)',
            animation: 'fadeInUp 0.18s ease',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 18px 10px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>🔑 How to add an API key</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Choose a provider and follow the steps</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
            >×</button>
          </div>

          {/* Provider tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 4px' }}>
            {providers.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                style={{
                  flex: 1, padding: '10px 4px', background: 'none',
                  border: 'none', borderBottom: activeTab === p.id ? `2px solid ${p.color}` : '2px solid transparent',
                  color: activeTab === p.id ? '#f1f5f9' : '#475569',
                  cursor: 'pointer', fontSize: 12, fontWeight: activeTab === p.id ? 700 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>

          {/* Active provider content */}
          <div style={{ padding: '16px 18px' }}>
            {/* Tagline + badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: `${active.badgeColor}22`, color: active.badgeColor,
                border: `1px solid ${active.badgeColor}44`,
              }}>{active.badge}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{active.tagline}</span>
            </div>

            {/* Models */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Available Models</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {active.models.map(m => (
                  <span key={m} style={{
                    padding: '3px 8px', borderRadius: 6, fontSize: 11,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8', fontFamily: 'monospace',
                  }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Step-by-Step Setup</div>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {active.steps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      minWidth: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                      background: `${active.color}22`, color: active.color,
                      border: `1px solid ${active.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key prefix hint */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '10px 12px', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>KEY FORMAT</span>
              <code style={{
                fontSize: 12, color: active.color, background: `${active.color}11`,
                padding: '2px 8px', borderRadius: 5, border: `1px solid ${active.color}22`,
              }}>{active.keyPrefix}••••••••••••</code>
            </div>

            {/* Note */}
            <div style={{
              padding: '10px 12px', borderRadius: 8, fontSize: 12, lineHeight: 1.5,
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
              color: '#94a3b8',
            }}>
              💡 {active.note}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 11, color: '#334155' }}>Keys are stored locally — never sent to our servers</span>
            <span style={{ fontSize: 11, color: '#10b981' }}>🔒 Local only</span>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { xp, moduleProgress, labBugs, badges, setLevel, level, groqSettings, updateGroqSettings, theme, setTheme } = useStore();
  const [keyInput, setKeyInput] = useState(groqSettings.apiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [testMsg, setTestMsg] = useState('');
  const [saved, setSaved] = useState(false);

  const saveKey = () => {
    const trimmed = keyInput.trim();
    updateGroqSettings({ apiKey: trimmed, enabled: trimmed.length > 0 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testKey = async () => {
    if (!keyInput.trim()) return;
    setTestStatus('testing');
    setTestMsg('');
    const r = await callGroq(keyInput.trim(), groqSettings.model, [
      { role: 'user', content: 'Say "Groq connected" and nothing else.' },
    ]);
    if (r.error) {
      setTestStatus('fail');
      setTestMsg(r.error);
    } else {
      setTestStatus('ok');
      setTestMsg(r.text.slice(0, 80));
    }
  };

  return (
    <AppShell>
      <div style={{ padding: '32px 40px', maxWidth: 680 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>⚙️ Settings</h1>
        <p style={{ color: '#94a3b8', margin: '0 0 32px' }}>Personalise your learning experience</p>

        {/* AI Mode banner */}
        <div style={{
          background: groqSettings.enabled ? 'rgba(99,102,241,0.08)' : 'rgba(16,185,129,0.08)',
          border: `1px solid ${groqSettings.enabled ? 'rgba(99,102,241,0.25)' : 'rgba(16,185,129,0.2)'}`,
          borderRadius: 14, padding: '16px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 28 }}>{groqSettings.enabled ? '🤖' : '✦'}</span>
          <div>
            <div style={{ fontWeight: 700, color: groqSettings.enabled ? '#a5b4fc' : '#10b981', fontSize: 15 }}>
              {groqSettings.enabled ? 'Groq AI Active — GPT-level responses enabled' : 'Built-in AI — No API key required'}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
              {groqSettings.enabled
                ? `Using ${groqSettings.model} via Groq free tier — instant, deep AI explanations`
                : 'No API key required. Add a free Groq key below to unlock GPT-level depth.'}
            </div>
          </div>
        </div>

        {/* Groq API Key */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#e2e8f0' }}>
              🔑 AI API Key
            </h2>
            <span style={{ fontWeight: 400, fontSize: 12, color: '#10b981' }}>Groq is free</span>
            <ApiKeyTooltip />
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
            Add a free <span style={{ color: '#f97316' }}>Groq</span>, paid <span style={{ color: '#10b981' }}>OpenAI/GPT</span>, or <span style={{ color: '#8b5cf6' }}>Anthropic/Claude</span> key.
            Click <strong style={{ color: '#a5b4fc' }}>?</strong> for step-by-step setup for any provider.
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="gsk_..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '10px 12px', color: '#e2e8f0', fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={testKey}
              disabled={!keyInput.trim() || testStatus === 'testing'}
              style={{
                padding: '10px 16px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                color: '#94a3b8', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
              }}
            >
              {testStatus === 'testing' ? '⏳ Testing…' : '🧪 Test'}
            </button>
            <button
              onClick={saveKey}
              style={{
                padding: '10px 16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              }}
            >
              {saved ? '✓ Saved' : 'Save'}
            </button>
          </div>

          {testStatus === 'ok' && (
            <div style={{ fontSize: 12, color: '#10b981', padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 6 }}>
              ✅ Connected — {testMsg}
            </div>
          )}
          {testStatus === 'fail' && (
            <div style={{ fontSize: 12, color: '#ef4444', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 6 }}>
              ❌ {testMsg}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Model</div>
            <select
              value={groqSettings.model}
              onChange={e => updateGroqSettings({ model: e.target.value })}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '10px 12px', color: '#e2e8f0', fontSize: 13, outline: 'none',
              }}
            >
              {GROQ_MODELS.map(m => (
                <option key={m.id} value={m.id} style={{ background: '#1a1a26' }}>
                  {m.label}{m.recommended ? ' ★' : ''}
                </option>
              ))}
            </select>
          </div>

          {groqSettings.enabled && (
            <button
              onClick={() => { updateGroqSettings({ apiKey: '', enabled: false }); setKeyInput(''); }}
              style={{
                marginTop: 12, padding: '6px 14px', background: 'transparent',
                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
                color: '#f87171', cursor: 'pointer', fontSize: 12,
              }}
            >
              Remove Groq key
            </button>
          )}
        </div>

        {/* Experience Level */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#e2e8f0' }}>🎯 Experience Level</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
            Affects AI tutor explanation depth and suggested learning path
          </p>
          <select
            value={level}
            onChange={e => setLevel(e.target.value as never)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '10px 12px', color: '#e2e8f0',
              fontSize: 13, outline: 'none', cursor: 'pointer',
            }}
          >
            {[
              ['beginner', '🌱 Beginner — new to software testing'],
              ['intermediate', '🌿 Intermediate — 1-2 years experience'],
              ['advanced', '⚡ Advanced — 3-5 years experience'],
              ['expert', '🔥 Expert — 5+ years, specialising in AI testing'],
              ['lead', '👑 QA Lead — leading a QA team'],
              ['manager', '🎯 QA Manager — managing QA strategy'],
              ['ai-engineer', '🤖 AI Quality Engineer — AI/ML testing focus'],
            ].map(([k, v]) => (
              <option key={k} value={k} style={{ background: '#1a1a26' }}>{v}</option>
            ))}
          </select>
        </div>

        {/* Progress Stats */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>📊 Your Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[
              { icon: '✨', label: 'Total XP', value: xp.toLocaleString(), color: '#a855f7' },
              { icon: '✅', label: 'Modules Completed', value: `${moduleProgress.filter(m => m.completed).length}/21`, color: '#6366f1' },
              { icon: '🐛', label: 'Bugs Found', value: `${labBugs.filter(b => b.found).length}`, color: '#10b981' },
              { icon: '🏅', label: 'Badges Earned', value: `${badges.length}`, color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{
                padding: '16px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#e2e8f0' }}>🎨 Appearance</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>Choose how QA Academy looks on your device</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { value: 'dark', icon: '🌙', label: 'Dark' },
              { value: 'light', icon: '☀️', label: 'Light' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value as 'dark' | 'light')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                  background: theme === opt.value ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  border: theme === opt.value ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 14 }}>{opt.icon}</span>
                <span style={{ fontSize: 13, fontWeight: theme === opt.value ? 700 : 400, color: theme === opt.value ? '#a5b4fc' : '#64748b' }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge base */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '24px 28px',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>🧠 Built-in Knowledge Base</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              'SDLC & STLC', 'Defect Lifecycle', 'Test Cases & Bug Reports',
              'BVA & Equivalence Partitioning', 'API Testing (REST, GraphQL)',
              'Playwright Automation', 'LLM Testing & Hallucination',
              'RAG System Testing', 'Agentic AI Testing', 'MCP Testing',
              'Prompt Injection & Jailbreaks', 'Performance Testing (K6/JMeter)',
              'Security Testing (OWASP)', 'Accessibility (WCAG)', 'DevOps & CI/CD',
              'QA Metrics & KPIs', 'Interview Prep (all levels)', 'Test Case Generator',
              'Bug Report Reviewer', 'Interview Answer Scorer',
            ].map(topic => (
              <div key={topic} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 12, color: '#94a3b8', padding: '6px 0',
              }}>
                <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
