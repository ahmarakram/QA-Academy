'use client';

import { use } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { getLabById } from '@/lib/lab-data';
import { DIFFICULTY_COLOR } from '@/lib/lab-data';

export default function LabWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lab = getLabById(id);

  if (!lab) {
    return (
      <AppShell>
        <div className="page-content" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔬</div>
          <h2 style={{ color: '#e2e8f0', marginBottom: 8 }}>Lab not found</h2>
          <Link href="/lab" style={{ color: '#a5b4fc', fontSize: 14 }}>← Back to Practice Lab</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-content" style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <Link href="/lab" style={{ fontSize: 13, color: '#475569', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 24 }}>
          ← Back to Practice Lab
        </Link>

        {/* Lab header */}
        <div style={{
          background: `linear-gradient(135deg, ${lab.color}14, rgba(0,0,0,0))`,
          border: `1px solid ${lab.color}30`, borderRadius: 20,
          padding: '28px 32px', marginBottom: 28,
        }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: `${lab.color}20`, border: `1px solid ${lab.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
            }}>{lab.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: `${DIFFICULTY_COLOR[lab.difficulty]}22`, color: DIFFICULTY_COLOR[lab.difficulty],
                }}>{lab.difficulty}</span>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>⏱ {lab.durationLabel}</span>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>🐛 {lab.bugCount} bugs</span>
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>{lab.title}</h1>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{lab.description}</p>
            </div>
          </div>
        </div>

        {/* Coming soon workspace */}
        <div style={{
          background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: '56px 40px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🚧</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0', marginBottom: 10 }}>
            Workspace Coming Soon
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
            The interactive workspace for <strong style={{ color: '#94a3b8' }}>{lab.title}</strong> is being built.
            While you wait, review the objectives below and prepare your test strategy.
          </p>

          {/* Objectives preview */}
          <div style={{ maxWidth: 500, margin: '0 auto 32px', textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What you will test:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lab.objectives.map((obj, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '9px 14px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
                }}>
                  <span style={{ color: lab.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample scenarios */}
          {lab.scenarios.length > 0 && (
            <div style={{ maxWidth: 500, margin: '0 auto 32px', textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sample scenarios ({lab.scenarios.length} total):</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {lab.scenarios.slice(0, 5).map(s => (
                  <div key={s.id} style={{
                    display: 'flex', gap: 10, padding: '9px 14px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
                  }}>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, fontWeight: 700, flexShrink: 0, marginTop: 2,
                      background: s.type === 'positive' ? 'rgba(16,185,129,0.12)' : s.type === 'negative' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                      color: s.type === 'positive' ? '#10b981' : s.type === 'negative' ? '#ef4444' : '#f59e0b',
                    }}>{s.type}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bug seeds preview for completeness */}
          {lab.hiddenBugs.length > 0 && (
            <div style={{ maxWidth: 500, margin: '0 auto 32px', textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🐛 {lab.hiddenBugs.length} bugs hidden inside — find them when the workspace launches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {lab.hiddenBugs.map(b => (
                  <span key={b.id} style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11,
                    background: b.severity === 'Critical' ? 'rgba(239,68,68,0.1)' : b.severity === 'High' ? 'rgba(249,115,22,0.1)' : 'rgba(245,158,11,0.1)',
                    color: b.severity === 'Critical' ? '#ef4444' : b.severity === 'High' ? '#f97316' : '#f59e0b',
                    border: `1px solid ${b.severity === 'Critical' ? 'rgba(239,68,68,0.2)' : b.severity === 'High' ? 'rgba(249,115,22,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  }}>{b.id} · {b.severity}</span>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/lab"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 24px',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 10, color: '#a5b4fc', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s',
            }}
          >
            ← Explore Other Labs
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
