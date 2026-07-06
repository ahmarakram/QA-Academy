'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { modules } from '@/lib/modules';

const levelLabels: Record<string, string> = {
  beginner: '🌱 Beginner',
  intermediate: '🌿 Intermediate',
  advanced: '⚡ Advanced',
  expert: '🔥 Expert',
  lead: '👑 QA Lead',
  manager: '🎯 QA Manager',
  'ai-engineer': '🤖 AI Quality Engineer',
};

const levelRoutes: Record<string, string> = {
  beginner: 'Start with Module 1 → Software Testing Fundamentals',
  intermediate: 'Start with Module 3 → Advanced Test Design',
  advanced: 'Start with Module 6 → Playwright Automation',
  expert: 'Start with Module 9 → AI Testing Track',
  lead: 'Start with Module 21 → QA Leadership & Strategy',
  manager: 'Start with Module 21 → QA Leadership & Strategy',
  'ai-engineer': 'Start with Module 9 → AI Quality Engineering Track',
};

const platformStats = [
  { icon: '📚', value: '21', label: 'Total Modules', color: '#6366f1', href: '/learning-path' },
  { icon: '🔬', value: '40+', label: 'Practice Labs', color: '#10b981', href: '/lab' },
  { icon: '🎯', value: '100+', label: 'Quiz Questions', color: '#a855f7', href: '/quiz' },
  { icon: '💼', value: '8', label: 'Capstone Projects', color: '#f59e0b', href: '/capstone' },
  { icon: '🏆', value: '50+', label: 'Achievements', color: '#ef4444', href: '/achievements' },
  { icon: '🤖', value: 'AI', label: 'Powered Tutor', color: '#14b8a6', href: '/ai-tutor' },
];

const trackDefs = [
  { track: 'Core Testing', icon: '🔍', color: '#6366f1', filter: 'core' },
  { track: 'Automation', icon: '🎭', color: '#10b981', filter: 'automation' },
  { track: 'AI Quality Engineering', icon: '🤖', color: '#a855f7', filter: 'ai-quality' },
  { track: 'Specialized', icon: '⚡', color: '#f59e0b', filter: 'specialized' },
  { track: 'Leadership', icon: '👑', color: '#d97706', filter: 'leadership' },
];

const quickActions = [
  { href: '/learning-path', icon: '📚', title: 'Start Learning', desc: '21 structured modules', color: '#6366f1' },
  { href: '/lab', icon: '🔬', title: 'Practice Lab', desc: 'Find hidden bugs', color: '#10b981' },
  { href: '/quiz', icon: '🎯', title: 'Quiz Center', desc: '100+ questions', color: '#a855f7' },
  { href: '/ai-tutor', icon: '🤖', title: 'AI Tutor', desc: 'Ask anything about QA', color: '#ec4899' },
  { href: '/interview-prep', icon: '💼', title: 'Interview Prep', desc: '53+ questions, 7 countries', color: '#f59e0b' },
  { href: '/certifications', icon: '🏅', title: 'Certifications', desc: '15+ certs with study guides', color: '#a855f7' },
  { href: '/jobs', icon: '🌍', title: 'Jobs Market', desc: 'Salaries & demand, 12 countries', color: '#14b8a6' },
  { href: '/capstone', icon: '🏆', title: 'Capstone Projects', desc: '8 real-world projects', color: '#ef4444' },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const dailyChallenges = [
  { title: 'Write 3 boundary value test cases for a date picker (min: 01/01/1900, max: today)', category: 'Test Design', xp: 50 },
  { title: 'Explain the difference between smoke testing and sanity testing with a real example', category: 'Fundamentals', xp: 30 },
  { title: 'Design 5 negative test cases for a user registration form', category: 'Manual Testing', xp: 50 },
  { title: 'Write a Playwright test that verifies an API response matches the UI display', category: 'Automation', xp: 75 },
  { title: 'List 3 hallucination test prompts you would use to test an LLM-powered chatbot', category: 'AI Testing', xp: 60 },
  { title: 'Identify the OWASP Top 3 risks and write one test case for each', category: 'Security', xp: 80 },
  { title: 'Describe how you would set up a k6 load test for a checkout endpoint (500 VU ramp)', category: 'Performance', xp: 65 },
];

const achievements = [
  { id: 'first-module',   icon: '🌱', title: 'First Steps',    desc: 'Complete your first module',         xp: 100  },
  { id: 'ten-bugs',       icon: '🔬', title: 'Bug Hunter',     desc: 'Find 5 bugs in Practice Lab',        xp: 200  },
  { id: 'quiz-master',    icon: '🎯', title: 'Quiz Master',    desc: 'Score 100% on any quiz',             xp: 150  },
  { id: 'ai-tutor-10',    icon: '🤖', title: 'AI Whisperer',   desc: 'Ask 10 questions to AI Tutor',       xp: 100  },
  { id: 'streak-7',       icon: '🔥', title: '7-Day Streak',   desc: 'Study 7 days in a row',              xp: 300  },
  { id: 'first-cert',     icon: '🏅', title: 'Cert Champion',  desc: 'Earn your first certificate',        xp: 500  },
  { id: 'xp-1000',        icon: '⚡', title: 'XP Collector',   desc: 'Earn 1,000 XP',                     xp: 75   },
  { id: 'cv-created',     icon: '📄', title: 'CV Pro',         desc: 'Generate your QA CV',                xp: 50   },
  { id: 'five-modules',   icon: '📚', title: 'Half Way',       desc: 'Complete 10 of 21 modules',          xp: 400  },
  { id: 'capstone-1',     icon: '🏆', title: 'Capstone Hero',  desc: 'Complete a capstone project',        xp: 750  },
  { id: 'all-modules',    icon: '💎', title: 'Full Stack QA',  desc: 'Complete all 21 modules',            xp: 2000 },
  { id: 'streak-30',      icon: '🌙', title: 'Month Master',   desc: 'Maintain a 30-day streak',           xp: 350  },
];

export default function Dashboard() {
  const { level, setLevel, xp, moduleProgress, labBugs, badges, addXP, streak, earnedCerts, tutorHistory } = useStore();
  const completedModules = moduleProgress.filter(m => m.completed).length;
  const bugsFound = labBugs.filter(b => b.found).length;
  const overallProgress = Math.round((completedModules / 21) * 100);

  // Derive unlocked achievements from real store state
  const unlockedIds = new Set<string>(badges);
  if (completedModules >= 1) unlockedIds.add('first-module');
  if (completedModules >= 5) unlockedIds.add('five-modules');
  if (completedModules >= 21) unlockedIds.add('all-modules');
  if (bugsFound >= 5) unlockedIds.add('ten-bugs');
  if (streak >= 7) unlockedIds.add('streak-7');
  if (streak >= 30) unlockedIds.add('streak-30');
  if (xp >= 1000) unlockedIds.add('xp-1000');
  if (earnedCerts && earnedCerts.length >= 1) unlockedIds.add('first-cert');
  if (tutorHistory && tutorHistory.length >= 10) unlockedIds.add('ai-tutor-10');
  // Use full date as seed so challenge changes daily, not just by day-of-week
  const todayChallenge = dailyChallenges[Math.floor(Date.now() / 86400000) % dailyChallenges.length];
  const [challengeDone, setChallengeOrDone] = React.useState(false);

  const stats = [
    { icon: '✅', value: `${completedModules}/21`, label: 'Modules Done', color: '#6366f1', rgb: '99,102,241' },
    { icon: '✨', value: xp.toLocaleString(), label: 'Experience Points', color: '#a855f7', rgb: '168,85,247' },
    { icon: '🐛', value: `${bugsFound}`, label: 'Bugs Found', color: '#10b981', rgb: '16,185,129' },
    { icon: '🏅', value: `${badges.length}`, label: 'Badges Earned', color: '#f59e0b', rgb: '245,158,11' },
  ];

  return (
    <AppShell>
      <div className="page-content fade-in-up">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="hero-card" style={{ marginBottom: 24 }}>
          {/* big background emoji */}
          <div style={{
            position: 'absolute', top: -30, right: -20, fontSize: 160,
            opacity: 0.04, pointerEvents: 'none', userSelect: 'none',
            animation: 'float 6s ease-in-out infinite',
          }}>🧪</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
              animation: 'float 4s ease-in-out infinite',
            }}>🧪</div>
            <div style={{ minWidth: 0 }}>
              <h1 className="hero-title">
                <span className="gradient-text">QA Academy</span>
              </h1>
              <p className="hero-subtitle">
                The world&apos;s most comprehensive AI-Powered Software Testing Platform
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
              <span>Overall Progress</span>
              <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{overallProgress}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${overallProgress}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 3s ease infinite, xp-fill 1.2s ease-out both',
                borderRadius: 3,
                boxShadow: '0 0 10px rgba(99,102,241,0.6)',
              }} />
            </div>
          </div>

          {/* Level selector */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div>
              <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                My Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as never)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 10, padding: '8px 14px', color: '#e2e8f0', fontSize: 13,
                  cursor: 'pointer', outline: 'none', transition: 'all 0.18s',
                }}
              >
                {Object.entries(levelLabels).map(([k, v]) => (
                  <option key={k} value={k} style={{ background: '#1a1a26' }}>{v}</option>
                ))}
              </select>
            </div>
            <div style={{
              padding: '8px 14px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 10, fontSize: 13, color: '#a5b4fc', alignSelf: 'flex-end',
              backdropFilter: 'blur(8px)',
            }}>
              💡 {levelRoutes[level]}
            </div>
          </div>
        </div>

        {/* ── Progress Stats ──────────────────────────────── */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card fade-in-up"
              style={{
                '--stat-color': stat.color,
                '--stat-rgb': stat.rgb,
                animationDelay: `${i * 80}ms`,
              } as React.CSSProperties}
            >
              <div style={{ fontSize: 24, marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Platform Overview ───────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <h2 className="section-title">Platform Overview</h2>
          <div className="platform-grid">
            {platformStats.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                className="platform-card fade-in-up"
                style={{ animationDelay: `${i * 60}ms`, textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${s.color}33`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div className="platform-icon" style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{s.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Learning Tracks ─────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Learning Tracks</h2>
            <Link href="/learning-path" style={{
              color: '#6366f1', fontSize: 13, textDecoration: 'none', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 12px', borderRadius: 20,
              border: '1px solid rgba(99,102,241,0.2)',
              transition: 'all 0.18s',
            }}>
              View all 21 modules →
            </Link>
          </div>
          {trackDefs.map((track) => {
            const trackMods = modules.filter(m => m.track === track.filter);
            const doneCount = trackMods.filter(mod => moduleProgress.some(p => p.moduleId === mod.id && p.completed)).length;
            return (
              <div key={track.track} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 15 }}>{track.icon}</span>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{track.track}</h3>
                  <span style={{
                    padding: '2px 9px', borderRadius: 20, fontSize: 10,
                    background: `${track.color}22`, color: track.color, border: `1px solid ${track.color}44`,
                    fontWeight: 600,
                  }}>{trackMods.length} modules</span>
                  {doneCount > 0 && (
                    <span style={{ fontSize: 11, color: '#10b981', marginLeft: 'auto' }}>
                      ✓ {doneCount}/{trackMods.length}
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))', gap: 8 }}>
                  {trackMods.map((mod) => {
                    const done = moduleProgress.some(p => p.moduleId === mod.id && p.completed);
                    const progress = moduleProgress.find(p => p.moduleId === mod.id);
                    const lastStudied = progress?.lastStudiedAt;
                    return (
                      <Link key={mod.id} href={`/module/${mod.id}`} className="mod-mini-card" style={{
                        background: done ? `${mod.color}14` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${done ? mod.color + '44' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                        {done && (
                          <span style={{
                            position: 'absolute', top: 8, right: 10,
                            color: '#10b981', fontSize: 12,
                            filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))',
                          }}>✓</span>
                        )}
                        <div style={{ fontSize: 18, marginBottom: 5 }}>{mod.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>
                          {mod.id}. {mod.title}
                        </div>
                        {lastStudied ? (
                          <div style={{ fontSize: 9, color: mod.color, marginTop: 3, opacity: 0.8 }}>
                            🕐 {timeAgo(lastStudied)}
                          </div>
                        ) : (
                          <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{mod.duration}</div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Daily Challenge ─────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <h2 className="section-title">Today&apos;s Challenge</h2>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
            border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: '20px 24px',
            display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>🎯</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{todayChallenge.category}</span>
                <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(168,85,247,0.2)', color: '#c084fc' }}>✨ +{todayChallenge.xp} XP</span>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 }}>
                {todayChallenge.title}
              </p>
              <button
                onClick={() => { if (!challengeDone) { addXP(todayChallenge.xp); setChallengeOrDone(true); } }}
                style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: challengeDone ? 'default' : 'pointer',
                  background: challengeDone ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.2)',
                  border: `1px solid ${challengeDone ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.4)'}`,
                  color: challengeDone ? '#10b981' : '#a5b4fc',
                }}
              >{challengeDone ? '✅ Challenge Complete!' : 'Mark as Complete'}</button>
            </div>
            <div style={{ fontSize: 11, color: '#334155', textAlign: 'right', flexShrink: 0 }}>
              Resets daily 🔄
            </div>
          </div>
        </div>

        {/* ── Achievements ────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Achievements</h2>
            <span style={{ fontSize: 12, color: '#475569' }}>{unlockedIds.size}/{achievements.length} unlocked</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {achievements.map((ach) => {
              const isUnlocked = unlockedIds.has(ach.id);
              return (
                <div key={ach.title} style={{
                  background: isUnlocked ? 'rgba(245,158,11,0.08)' : '#12121a',
                  border: `1px solid ${isUnlocked ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12, padding: '14px', textAlign: 'center',
                  opacity: isUnlocked ? 1 : 0.5, transition: 'all 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {isUnlocked && <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 10, color: '#f59e0b' }}>✓</div>}
                  <div style={{ fontSize: 28, marginBottom: 6, filter: isUnlocked ? 'none' : 'grayscale(1)' }}>{ach.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isUnlocked ? '#fbbf24' : '#64748b', marginBottom: 3 }}>{ach.title}</div>
                  <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.4, marginBottom: 6 }}>{ach.desc}</div>
                  <div style={{ fontSize: 10, color: isUnlocked ? '#f59e0b' : '#334155' }}>✨ {ach.xp} XP</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick Actions ───────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h2 className="section-title">Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {quickActions.map((action, i) => (
              <Link
                key={action.href}
                href={action.href}
                className="action-card fade-in-up"
                style={{
                  '--action-color': action.color + '33',
                  animationDelay: `${i * 50}ms`,
                } as React.CSSProperties}
              >
                {/* color top strip */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: action.color, borderRadius: '16px 16px 0 0', opacity: 0.7,
                }} />
                <div style={{ fontSize: 28, marginBottom: 10 }}>{action.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{action.title}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 3, marginBottom: 12 }}>{action.desc}</div>
                <div className="action-arrow" style={{ fontSize: 12, color: action.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Get started <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
