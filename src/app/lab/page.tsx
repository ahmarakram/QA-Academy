'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';
import {
  LAB_CATALOG,
  ALL_DIFFICULTIES,
  ALL_QA_TYPES,
  ALL_DOMAINS,
  DURATION_RANGES,
  DIFFICULTY_COLOR,
  QATYPE_COLOR,
  type Difficulty,
  type QAType,
  type Domain,
  type Lab,
} from '@/lib/lab-data';

// ─── Sub-components ───────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span style={{
      padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
      background: `${DIFFICULTY_COLOR[level]}22`,
      color: DIFFICULTY_COLOR[level],
      border: `1px solid ${DIFFICULTY_COLOR[level]}40`,
      letterSpacing: '0.02em',
    }}>
      {level}
    </span>
  );
}

function LabTag({ label, type }: { label: string; type: QAType }) {
  const c = QATYPE_COLOR[type] ?? '#6366f1';
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
      background: `${c}18`, color: c, border: `1px solid ${c}35`,
    }}>
      {label}
    </span>
  );
}

function StatPill({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
    </div>
  );
}

function LiveBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
      background: 'rgba(16,185,129,0.12)', color: '#10b981',
      border: '1px solid rgba(16,185,129,0.3)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: '#10b981',
        boxShadow: '0 0 0 2px rgba(16,185,129,0.3)',
        animation: 'pulse 2s ease-in-out infinite',
        display: 'inline-block',
      }} />
      Live
    </div>
  );
}

function LabCard({ lab, bugsFound, onViewDetails }: {
  lab: Lab;
  bugsFound: number;
  onViewDetails: (lab: Lab) => void;
}) {
  const progress = lab.bugCount > 0 ? Math.round((bugsFound / lab.bugCount) * 100) : 0;

  return (
    <div style={{
      background: '#12121a',
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 18,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${lab.color}50`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${lab.color}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Colour bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${lab.color}, ${lab.color}60)` }} />

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Header row */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13, flexShrink: 0,
            background: `${lab.color}18`, border: `1px solid ${lab.color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            {lab.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 }}>
              <DifficultyBadge level={lab.difficulty} />
              {lab.isLive && <LiveBadge />}
              {lab.isNew && (
                <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 9, fontWeight: 800, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', letterSpacing: '0.05em' }}>NEW</span>
              )}
              {lab.isFeatured && (
                <span style={{ padding: '2px 7px', borderRadius: 20, fontSize: 9, fontWeight: 800, background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)', letterSpacing: '0.05em' }}>★ FEATURED</span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
              {lab.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p style={{ margin: '0 0 14px', fontSize: 12, color: '#64748b', lineHeight: 1.65, flex: 1 }}>
          {lab.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
          <StatPill icon="⏱" value={lab.durationLabel} label="" color="#94a3b8" />
          <StatPill icon="🐛" value={lab.bugCount} label="bugs" color="#ef4444" />
          <StatPill icon="🧪" value={lab.scenarioCount} label="scenarios" color="#6366f1" />
        </div>

        {/* Progress bar (only if started) */}
        {bugsFound > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginBottom: 4 }}>
              <span>Progress</span>
              <span style={{ color: lab.color }}>{bugsFound}/{lab.bugCount} bugs · {progress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${lab.color}, ${lab.color}aa)`, borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        {/* Skills */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
          {lab.tags.map(t => <LabTag key={t} label={t} type={t} />)}
        </div>

        {/* Domain chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4 }}>
            {lab.domain}
          </span>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href={lab.route}
            style={{
              flex: 1, padding: '9px 14px', textAlign: 'center',
              background: lab.isLive
                ? `linear-gradient(135deg, ${lab.color}30, ${lab.color}18)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${lab.isLive ? lab.color + '60' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8, fontSize: 12, fontWeight: 700,
              color: lab.isLive ? lab.color : '#64748b',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all 0.15s',
              cursor: lab.isLive ? 'pointer' : 'not-allowed',
              pointerEvents: lab.isLive ? 'auto' : 'none',
            }}
          >
            {lab.isLive ? '🚀 Start Lab' : '🔒 Coming Soon'}
          </Link>
          <button
            onClick={() => onViewDetails(lab)}
            style={{
              padding: '9px 14px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#a5b4fc';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            Details ↗
          </button>
        </div>
      </div>
    </div>
  );
}

function LabDetailDrawer({ lab, onClose }: { lab: Lab; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 1000, backdropFilter: 'blur(4px)',
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: 520,
        background: '#0f0f1a', borderLeft: `1px solid ${lab.color}30`,
        zIndex: 1001, overflowY: 'auto', padding: '28px 28px 40px',
        animation: 'slideInRight 0.25s ease',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
            color: '#64748b', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {/* Icon + title */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, flexShrink: 0,
            background: `${lab.color}18`, border: `1px solid ${lab.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>
            {lab.icon}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <DifficultyBadge level={lab.difficulty} />
              {lab.isLive && <LiveBadge />}
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>{lab.title}</h2>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#475569' }}>{lab.domain} · {lab.durationLabel}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
          {[
            { icon: '🐛', val: lab.bugCount, label: 'Hidden Bugs', color: '#ef4444' },
            { icon: '🧪', val: lab.scenarioCount, label: 'Scenarios', color: '#6366f1' },
            { icon: '⏱', val: lab.durationLabel, label: 'Duration', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '12px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Long description */}
        <div style={{ marginBottom: 22 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>About this Lab</h4>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{lab.longDescription}</p>
        </div>

        {/* Objectives */}
        <div style={{ marginBottom: 22 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Learning Objectives</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {lab.objectives.map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: lab.color, fontWeight: 700, flexShrink: 0, fontSize: 13, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User roles */}
        {lab.userRoles.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>User Roles Tested</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {lab.userRoles.map(r => (
                <span key={r} style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12,
                  background: `${lab.color}15`, color: lab.color, border: `1px solid ${lab.color}30`,
                }}>👤 {r}</span>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div style={{ marginBottom: 22 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills Covered</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {lab.skills.map(s => (
              <span key={s} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12,
                background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)',
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Automation stack */}
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Automation Stack</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {lab.automationStack.map(t => (
              <span key={t} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12,
                background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)',
              }}>🛠 {t}</span>
            ))}
          </div>
        </div>

        {/* Scenarios preview */}
        {lab.scenarios.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sample Scenarios</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {lab.scenarios.slice(0, 6).map(s => (
                <div key={s.id} style={{
                  display: 'flex', gap: 10, padding: '9px 12px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
                }}>
                  <span style={{
                    fontSize: 9, padding: '2px 6px', borderRadius: 3, fontWeight: 700, flexShrink: 0, marginTop: 1,
                    background: s.type === 'positive' ? 'rgba(16,185,129,0.12)' : s.type === 'negative' ? 'rgba(239,68,68,0.12)' : s.type === 'security' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
                    color: s.type === 'positive' ? '#10b981' : s.type === 'negative' ? '#ef4444' : s.type === 'security' ? '#f59e0b' : '#a5b4fc',
                  }}>{s.type}</span>
                  <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{s.title}</span>
                </div>
              ))}
              {lab.scenarios.length > 6 && (
                <p style={{ margin: 0, fontSize: 11, color: '#334155', textAlign: 'center' }}>
                  +{lab.scenarios.length - 6} more scenarios inside the lab
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={lab.route}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '13px', textAlign: 'center',
            background: lab.isLive ? `linear-gradient(135deg, ${lab.color}, ${lab.color}bb)` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${lab.isLive ? lab.color : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10, fontSize: 14, fontWeight: 700,
            color: lab.isLive ? '#fff' : '#64748b',
            textDecoration: 'none',
            pointerEvents: lab.isLive ? 'auto' : 'none',
            boxSizing: 'border-box',
          }}
        >
          {lab.isLive ? '🚀 Launch Lab' : '🔒 Coming Soon'}
        </Link>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

function LabFilterBar({
  difficulty, setDifficulty,
  qaType, setQAType,
  domain, setDomain,
  duration, setDuration,
  search, setSearch,
  onClear,
  totalCount, filteredCount,
}: {
  difficulty: Difficulty | 'All';
  setDifficulty: (v: Difficulty | 'All') => void;
  qaType: QAType | 'All';
  setQAType: (v: QAType | 'All') => void;
  domain: Domain | 'All';
  setDomain: (v: Domain | 'All') => void;
  duration: string;
  setDuration: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onClear: () => void;
  totalCount: number;
  filteredCount: number;
}) {
  const hasFilter = difficulty !== 'All' || qaType !== 'All' || domain !== 'All' || duration !== 'All' || search !== '';

  return (
    <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', marginBottom: 24 }}>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#475569' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search labs by title, skill, or domain…"
          style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 40px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#e2e8f0', fontSize: 13, outline: 'none',
          }}
        />
      </div>

      {/* Filter rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>

        {/* Difficulty */}
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Difficulty</label>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {(['All', ...ALL_DIFFICULTIES] as const).map(d => (
              <button key={d} onClick={() => setDifficulty(d as Difficulty | 'All')} style={{
                padding: '4px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
                background: difficulty === d ? (d === 'All' ? '#6366f1' : DIFFICULTY_COLOR[d as Difficulty]) : 'rgba(255,255,255,0.05)',
                border: `1px solid ${difficulty === d ? (d === 'All' ? '#6366f1' : DIFFICULTY_COLOR[d as Difficulty]) : 'rgba(255,255,255,0.1)'}`,
                color: difficulty === d ? '#fff' : '#64748b',
                transition: 'all 0.15s', fontWeight: difficulty === d ? 700 : 400,
              }}>{d}</button>
            ))}
          </div>
        </div>

        {/* QA Type */}
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>QA Type</label>
          <select
            value={qaType}
            onChange={e => setQAType(e.target.value as QAType | 'All')}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '7px 10px', color: '#e2e8f0', fontSize: 12, outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="All" style={{ background: '#1a1a26' }}>All Types</option>
            {ALL_QA_TYPES.map(t => <option key={t} value={t} style={{ background: '#1a1a26' }}>{t}</option>)}
          </select>
        </div>

        {/* Domain */}
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Domain</label>
          <select
            value={domain}
            onChange={e => setDomain(e.target.value as Domain | 'All')}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '7px 10px', color: '#e2e8f0', fontSize: 12, outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="All" style={{ background: '#1a1a26' }}>All Domains</option>
            {ALL_DOMAINS.map(d => <option key={d} value={d} style={{ background: '#1a1a26' }}>{d}</option>)}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Duration</label>
          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: '7px 10px', color: '#e2e8f0', fontSize: 12, outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="All" style={{ background: '#1a1a26' }}>Any Duration</option>
            {DURATION_RANGES.map(r => <option key={r.label} value={r.label} style={{ background: '#1a1a26' }}>{r.label}</option>)}
          </select>
        </div>
      </div>

      {/* Active filter summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <span style={{ fontSize: 12, color: '#475569' }}>
          Showing <strong style={{ color: '#e2e8f0' }}>{filteredCount}</strong> of <strong style={{ color: '#e2e8f0' }}>{totalCount}</strong> labs
        </span>
        {hasFilter && (
          <button
            onClick={onClear}
            style={{
              padding: '4px 12px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
              color: '#64748b', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >✕ Clear filters</button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#334155' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#475569', marginBottom: 8 }}>No labs match your filters</div>
      <p style={{ fontSize: 13, color: '#334155', marginBottom: 20, lineHeight: 1.6 }}>
        Try adjusting your difficulty, QA type, or domain filters.<br />
        More labs are added regularly.
      </p>
      <button
        onClick={onClear}
        style={{
          padding: '10px 24px', background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8,
          color: '#a5b4fc', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Clear All Filters
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PracticeLabDashboard() {
  const { labBugs } = useStore();

  // Filters
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');
  const [qaType, setQAType] = useState<QAType | 'All'>('All');
  const [domain, setDomain] = useState<Domain | 'All'>('All');
  const [duration, setDuration] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Detail drawer
  const [detailLab, setDetailLab] = useState<Lab | null>(null);

  const clearFilters = () => {
    setDifficulty('All'); setQAType('All');
    setDomain('All'); setDuration('All'); setSearch('');
  };

  const filteredLabs = useMemo(() => {
    return LAB_CATALOG.filter(lab => {
      if (difficulty !== 'All' && lab.difficulty !== difficulty) return false;
      if (qaType !== 'All' && !lab.tags.includes(qaType)) return false;
      if (domain !== 'All' && lab.domain !== domain) return false;
      if (duration !== 'All') {
        const range = DURATION_RANGES.find(r => r.label === duration);
        if (range && (lab.durationMin < range.min || lab.durationMin > range.max)) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !lab.title.toLowerCase().includes(q) &&
          !lab.domain.toLowerCase().includes(q) &&
          !lab.skills.some(s => s.toLowerCase().includes(q)) &&
          !lab.description.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [difficulty, qaType, domain, duration, search]);

  // Global stats
  const totalBugs = LAB_CATALOG.reduce((a, l) => a + l.bugCount, 0);
  const totalScenarios = LAB_CATALOG.reduce((a, l) => a + l.scenarioCount, 0);
  const liveLabs = LAB_CATALOG.filter(l => l.isLive).length;
  const foundBugsForLab = (labId: string) =>
    labBugs.filter(b => b.found && b.id.startsWith(labId + '-')).length +
    (labId === '1' ? labBugs.filter(b => b.found && b.id.startsWith('S-')).length : 0);

  // Group filtered labs by difficulty for visual hierarchy
  const featured = filteredLabs.filter(l => l.isFeatured || l.isLive);
  const rest = filteredLabs.filter(l => !l.isFeatured && !l.isLive);

  return (
    <AppShell>
      <div className="page-content fade-in-up">

        {/* ── Hero header ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(168,85,247,0.08))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20,
          padding: '28px 32px', marginBottom: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -10, fontSize: 160, opacity: 0.03, pointerEvents: 'none', lineHeight: 1 }}>🔬</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 6px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                🔬 Practice Lab
              </h1>
              <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: 14, lineHeight: 1.6, maxWidth: 560 }}>
                {LAB_CATALOG.length} real-world QA workspaces across {ALL_DOMAINS.length} domains. Find hidden bugs, write test cases, practice automation, and build a job-ready portfolio.
              </p>
            </div>
          </div>

          {/* Stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {[
              { icon: '🧪', label: 'Total Labs',      value: LAB_CATALOG.length,  color: '#6366f1' },
              { icon: '🐛', label: 'Hidden Bugs',     value: `${totalBugs}+`,      color: '#ef4444' },
              { icon: '📋', label: 'Test Scenarios',  value: `${totalScenarios}+`, color: '#10b981' },
              { icon: '🚀', label: 'Live Now',         value: liveLabs,             color: '#f59e0b' },
              { icon: '🏢', label: 'Domains',          value: ALL_DOMAINS.length,   color: '#a855f7' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter bar ── */}
        <LabFilterBar
          difficulty={difficulty} setDifficulty={setDifficulty}
          qaType={qaType} setQAType={setQAType}
          domain={domain} setDomain={setDomain}
          duration={duration} setDuration={setDuration}
          search={search} setSearch={setSearch}
          onClear={clearFilters}
          totalCount={LAB_CATALOG.length}
          filteredCount={filteredLabs.length}
        />

        {/* ── Empty state ── */}
        {filteredLabs.length === 0 && <EmptyState onClear={clearFilters} />}

        {/* ── Featured / Live section ── */}
        {featured.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>⭐ Featured & Live Labs</h2>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
              {featured.map(lab => (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  bugsFound={foundBugsForLab(lab.id)}
                  onViewDetails={setDetailLab}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── All other labs ── */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>🗺 All Practice Labs</h2>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
              {rest.map(lab => (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  bugsFound={foundBugsForLab(lab.id)}
                  onViewDetails={setDetailLab}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom tip banner ── */}
        {filteredLabs.length > 0 && (
          <div style={{
            marginTop: 36, background: '#12121a',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px',
            display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 28 }}>💡</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                Pro Tip: Build your QA Portfolio
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.7, maxWidth: 620 }}>
                Document every bug you find here as a real bug report. Take screenshots, write steps to reproduce, assess severity. Paste your bug reports into a GitHub repo or Notion page — this is exactly the kind of work hiring managers ask for in QA interviews.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Detail drawer */}
      {detailLab && (
        <LabDetailDrawer lab={detailLab} onClose={() => setDetailLab(null)} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </AppShell>
  );
}
