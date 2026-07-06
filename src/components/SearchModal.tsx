'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { modules } from '@/lib/modules';

interface SearchResult {
  type: 'module' | 'page' | 'topic';
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  color?: string;
}

const staticPages: SearchResult[] = [
  { type: 'page', icon: '🏠', title: 'Dashboard', subtitle: 'Your learning overview', href: '/' },
  { type: 'page', icon: '📚', title: 'Learning Path', subtitle: '21 comprehensive modules', href: '/learning-path' },
  { type: 'page', icon: '🔬', title: 'Practice Lab', subtitle: 'Find hidden bugs', href: '/lab' },
  { type: 'page', icon: '🎯', title: 'Quiz Center', subtitle: '100+ questions', href: '/quiz' },
  { type: 'page', icon: '🤖', title: 'AI Tutor', subtitle: 'Ask anything about QA', href: '/ai-tutor' },
  { type: 'page', icon: '💼', title: 'Interview Prep', subtitle: '53+ questions, 7 countries', href: '/interview-prep' },
  { type: 'page', icon: '🏅', title: 'Certifications', subtitle: '15+ certification guides', href: '/certifications' },
  { type: 'page', icon: '🌍', title: 'Jobs Market', subtitle: 'Salaries & demand, 12 countries', href: '/jobs' },
  { type: 'page', icon: '🏆', title: 'Capstone Projects', subtitle: '8 real-world projects', href: '/capstone' },
  { type: 'page', icon: '📖', title: 'Glossary', subtitle: '45+ QA terms', href: '/glossary' },
  { type: 'page', icon: '⚙️', title: 'Settings', subtitle: 'AI & account settings', href: '/settings' },
];

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [...staticPages];
  modules.forEach(mod => {
    results.push({
      type: 'module',
      icon: mod.icon,
      title: `Module ${mod.id}: ${mod.title}`,
      subtitle: `${mod.difficulty} · ${mod.duration} · ${mod.track}`,
      href: `/module/${mod.id}`,
      color: mod.color,
    });
    mod.topics.forEach(topic => {
      results.push({
        type: 'topic',
        icon: '🔖',
        title: topic,
        subtitle: `Topic in ${mod.title}`,
        href: `/module/${mod.id}`,
        color: mod.color,
      });
    });
  });
  return results;
}

const searchIndex = buildIndex();

function search(query: string): SearchResult[] {
  if (!query.trim()) return staticPages.slice(0, 6);
  const q = query.toLowerCase();
  return searchIndex
    .filter(r => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q))
    .slice(0, 12);
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(staticPages.slice(0, 6));
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults(staticPages.slice(0, 6));
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(search(query));
    setSelected(0);
  }, [query]);

  const navigate = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); return; }
      if (e.key === 'Enter' && results[selected]) { navigate(results[selected].href); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selected, navigate, onClose]);

  if (!open) return null;

  const typeLabel: Record<string, string> = { module: 'Module', page: 'Page', topic: 'Topic' };
  const typeColor: Record<string, string> = { module: '#6366f1', page: '#10b981', topic: '#f59e0b' };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 600, margin: '0 16px',
        background: '#0f0f1a', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.15)',
        animation: 'fadeInUp 0.2s ease',
      }}>
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules, topics, pages…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#f1f5f9', fontSize: 16, fontFamily: 'inherit',
            }}
          />
          <kbd style={{
            padding: '2px 7px', borderRadius: 5, fontSize: 11,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#64748b', fontFamily: 'inherit',
          }}>Esc</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {results.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#334155', fontSize: 14 }}>
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {!query && (
                <div style={{ padding: '8px 16px 4px', fontSize: 11, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Quick navigation
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={`${r.href}-${r.title}-${i}`}
                  onClick={() => navigate(r.href)}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', background: i === selected ? 'rgba(99,102,241,0.12)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    borderLeft: i === selected ? '3px solid #6366f1' : '3px solid transparent',
                    transition: 'all 0.1s',
                  }}
                >
                  <span style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: r.color ? `${r.color}22` : 'rgba(255,255,255,0.05)',
                    border: r.color ? `1px solid ${r.color}33` : '1px solid rgba(255,255,255,0.08)',
                    fontSize: 16,
                  }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: i === selected ? '#f1f5f9' : '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{r.subtitle}</div>
                  </div>
                  <span style={{
                    padding: '2px 7px', borderRadius: 4, fontSize: 10,
                    background: `${typeColor[r.type]}18`,
                    color: typeColor[r.type],
                    border: `1px solid ${typeColor[r.type]}30`,
                    flexShrink: 0, fontWeight: 600,
                  }}>{typeLabel[r.type]}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', gap: 14, fontSize: 11, color: '#334155',
        }}>
          <span><kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>↵</kbd> open</span>
          <span><kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>Esc</kbd> close</span>
          <span style={{ marginLeft: 'auto' }}>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
