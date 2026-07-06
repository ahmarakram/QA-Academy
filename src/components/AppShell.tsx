'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AITutorFloat from './AITutorFloat';
import SearchModal from './SearchModal';
import OnboardingWizard from './OnboardingWizard';
import Logo from './Logo';
import { useStore } from '@/lib/store';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { hasOnboarded, recordActivity } = useStore();

  // Record daily activity for streak tracking
  useEffect(() => {
    recordActivity();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enhancement 9: global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K  or  /  to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      // / to open search (when not in input)
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflowY: 'auto' }}>
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <Logo size={26} showText />
          {/* Search button in topbar */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            style={{
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, transition: 'all 0.15s',
            }}
          >🔍</button>
        </div>

        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>

      <AITutorFloat />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      {!hasOnboarded && <OnboardingWizard />}
    </div>
  );
}
