'use client';

import AppShell from '@/components/AppShell';
import { modules, trackColors, trackLabels } from '@/lib/modules';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { useState } from 'react';

const difficultyColor: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#6366f1',
  Advanced: '#f59e0b',
  Expert: '#ef4444',
  'QA Lead / Manager': '#d97706',
};

export default function LearningPath() {
  const { moduleProgress } = useStore();
  const [filter, setFilter] = useState<string>('all');

  const tracks = ['all', 'core', 'automation', 'ai-quality', 'specialized', 'leadership'];
  const filtered = filter === 'all' ? modules : modules.filter(m => m.track === filter);

  return (
    <AppShell>
      <div className="page-content fade-in-up">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <span className="gradient-text">Learning Path</span>
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: 14 }}>
            21 comprehensive modules — from testing fundamentals to AI Quality Engineering
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tracks.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`filter-pill ${filter === t ? 'active' : ''}`}
              >
                {t === 'all' ? '✦ All Tracks' : trackLabels[t]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((mod, idx) => {
            const done = moduleProgress.some(p => p.moduleId === mod.id && p.completed);
            const borderColor = done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)';
            const delay = `${idx * 40}ms`;
            return (
              <Link key={mod.id} href={`/module/${mod.id}`} style={{ textDecoration: 'none' }}>
                <div
                  className="mod-card fade-in-up"
                  style={{ border: `1px solid ${borderColor}`, animationDelay: delay }}
                >
                  {/* color top strip */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${mod.color}, transparent)`,
                    borderRadius: '16px 16px 0 0',
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div
                      className="mod-icon"
                      style={{
                        width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                        background: `${mod.color}28`,
                        border: `1px solid ${mod.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24,
                        boxShadow: `0 4px 16px ${mod.color}22`,
                      }}
                    >
                      {mod.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#475569' }}>Module {mod.id}</span>
                        {done && (
                          <span style={{ color: '#10b981', fontSize: 11, fontWeight: 600 }}>✓ Completed</span>
                        )}
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
                        {mod.title}
                      </h3>
                      <p style={{ margin: '0 0 10px', fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                        {mod.subtitle}
                      </p>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: 11,
                          background: `${difficultyColor[mod.difficulty] || '#6366f1'}22`,
                          color: difficultyColor[mod.difficulty] || '#a5b4fc',
                          border: `1px solid ${difficultyColor[mod.difficulty] || '#6366f1'}44`,
                        }}>
                          {mod.difficulty}
                        </span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: 11,
                          background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          ⏱ {mod.duration}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${trackColors[mod.track]}`}>
                          {trackLabels[mod.track]}
                        </span>
                      </div>

                      <div style={{ fontSize: 11, color: '#334155' }}>
                        {mod.topics.slice(0, 4).join(' · ')}
                        {mod.topics.length > 4 ? ` · +${mod.topics.length - 4} more` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{ fontSize: 11, color: '#334155' }}>
                      🔬 {mod.labs.length} labs
                      {mod.tools ? ` · 🛠 ${mod.tools.length} tools` : ''}
                    </span>
                    <span style={{
                      fontSize: 12, color: mod.color, fontWeight: 600,
                      padding: '4px 12px', borderRadius: 20,
                      background: `${mod.color}18`,
                      border: `1px solid ${mod.color}33`,
                    }}>
                      {done ? '↩ Review' : 'Start →'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
