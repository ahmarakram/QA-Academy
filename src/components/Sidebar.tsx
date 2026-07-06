'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import Logo from './Logo';

const navItems = [
  { href: '/', icon: '🏠', label: 'Dashboard' },
  { href: '/learning-path', icon: '📚', label: 'Learning Path' },
  { href: '/lab', icon: '🔬', label: 'Practice Lab' },
  { href: '/quiz', icon: '🎯', label: 'Quiz Center' },
  { href: '/ai-tutor', icon: '🤖', label: 'AI Tutor' },
  { href: '/interview-prep', icon: '💼', label: 'Interview Prep' },
  { href: '/certifications', icon: '🏅', label: 'Certifications' },
  { href: '/jobs', icon: '🌍', label: 'Jobs Market' },
  { href: '/capstone', icon: '🏆', label: 'Capstone Projects' },
  { href: '/glossary', icon: '📖', label: 'Glossary' },
  { href: '/pricing', icon: '💎', label: 'Plans & Pricing' },
  { href: '/guide', icon: '🎬', label: 'Help & Guide' },
  { href: '/cicd', icon: '🔄', label: 'CI/CD & GitHub' },
  { href: '/ai-tools', icon: '🛠️', label: 'AI Tools & IDEs' },
  { href: '/automation-tools', icon: '🧪', label: 'Automation Tools' },
  { href: '/career', icon: '🚀', label: 'Career Intelligence' },
  { href: '/cv-writer', icon: '📄', label: 'CV / Resume Writer' },
  { href: '/manual', icon: '📘', label: 'User Manual' },
  { href: '/video-tour', icon: '🎬', label: 'Product Video Tour' },
  { href: '/settings', icon: '⚙️', label: 'AI Settings' },
];

const levelLabels: Record<string, string> = {
  beginner: '🌱 Beginner',
  intermediate: '🌿 Intermediate',
  advanced: '⚡ Advanced',
  expert: '🔥 Expert',
  lead: '👑 QA Lead',
  manager: '🎯 QA Manager',
  'ai-engineer': '🤖 AI Quality Eng',
};

const levelColors: Record<string, string> = {
  beginner: '#10b981',
  intermediate: '#6366f1',
  advanced: '#f59e0b',
  expert: '#ef4444',
  lead: '#d97706',
  manager: '#d97706',
  'ai-engineer': '#a855f7',
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { level, xp, moduleProgress, badges, labBugs, streak } = useStore();

  const completedModules = moduleProgress.filter(m => m.completed).length;
  const xpToNextLevel = 500;
  const xpProgress = Math.min((xp % xpToNextLevel) / xpToNextLevel * 100, 100);
  const lvlColor = levelColors[level] ?? '#6366f1';

  const streakColor = streak >= 7 ? '#ef4444' : streak >= 3 ? '#f59e0b' : '#10b981';
  const streakIcon = streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '✨';

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={36} showText />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, width: 28, height: 28, cursor: 'pointer',
                  color: '#64748b', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                aria-label="Close menu"
              >✕</button>
            )}
          </div>
        </div>

        {/* Level badge */}
        <div style={{
          marginTop: 14, padding: '7px 12px', borderRadius: 10,
          background: `${lvlColor}18`,
          border: `1px solid ${lvlColor}35`,
          fontSize: 12, color: lvlColor, textAlign: 'center', fontWeight: 600,
          transition: 'all 0.3s',
        }}>
          {levelLabels[level]}
        </div>
      </div>

      {/* XP + Streak */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8 }}>
          <span style={{ color: '#a5b4fc', fontWeight: 600 }}>✨ {xp.toLocaleString()} XP</span>
          <span style={{ color: '#6366f1' }}>{completedModules}/21 modules</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>

        {/* Streak + stats row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 11 }}>
          {/* Streak badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 20,
            background: `${streakColor}18`,
            border: `1px solid ${streakColor}33`,
            color: streakColor, fontWeight: 600,
          }}>
            {streakIcon} {streak}d streak
          </div>
          <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ color: '#10b981' }}>🐛</span>{labBugs.filter(b => b.found).length}
          </span>
          <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ color: '#f59e0b' }}>🏅</span>{badges.length}
          </span>
        </div>
      </div>

      {/* Search trigger */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(99,102,241,0.06)' }}>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
            }
          }}
          style={{
            width: '100%', padding: '7px 10px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569',
            transition: 'all 0.18s',
          }}
        >
          <span>🔍</span>
          <span style={{ flex: 1 }}>Search…</span>
          <kbd style={{
            padding: '1px 5px', borderRadius: 4, fontSize: 10,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#334155', fontFamily: 'inherit',
          }}>⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px 8px', fontWeight: 600 }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              {active && (
                <span style={{
                  marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                  background: '#6366f1', flexShrink: 0,
                  boxShadow: '0 0 6px rgba(99,102,241,0.8)',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(99,102,241,0.08)',
        fontSize: 10, color: '#1e293b',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
        AI-Powered QA Learning
      </div>
    </aside>
  );
}
