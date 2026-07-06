'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const STEPS = [
  { path: '/',               selector: '#tour-hero',         title: '🏠 Dashboard',         desc: 'Your command centre — tracks XP, streak, completed modules, and bugs found in real time.' },
  { path: '/',               selector: '#tour-stats',        title: '📊 Progress Stats',     desc: 'See how many modules you\'ve completed, total XP earned, bugs found, and badges unlocked.' },
  { path: '/',               selector: '#tour-quick-actions',title: '⚡ Quick Actions',       desc: 'Jump straight into modules, practice lab, quizzes, AI tutor, certifications, or capstone projects.' },
  { path: '/learning-path',  selector: null,                 title: '📚 Learning Path',      desc: '21 structured modules across 5 tracks — Core Testing, Automation, AI Quality Engineering, Specialised, and Leadership.' },
  { path: '/quiz',           selector: null,                 title: '🎯 Quiz Center',        desc: '100+ adaptive questions. Difficulty adjusts to your level, and every wrong answer gets an AI explanation.' },
  { path: '/lab',            selector: null,                 title: '🔬 Practice Lab',       desc: 'Find hidden bugs in simulated real-world apps. Each bug you find earns XP.' },
  { path: '/ai-tutor',       selector: null,                 title: '🤖 AI Tutor',           desc: 'Your 24/7 QA mentor powered by Llama 3.3 70B. Ask anything — explanations, test cases, career advice.' },
  { path: '/certifications', selector: null,                 title: '🏅 Certifications',     desc: 'Study guides and timed exam simulators for 19 industry certs — ISTQB, Playwright, AWS, Cypress, and more.' },
  { path: '/capstone',       selector: null,                 title: '🏆 Capstone Projects',  desc: '8 real-world QA workspaces: E-Commerce, SaaS, HealthTech, FinTech, AI Chatbot, RAG, Agentic AI, MCP.' },
  { path: '/cv-writer',      selector: null,                 title: '📄 CV Writer',          desc: 'Generate a professional QA CV tailored to your level and target role using your platform progress.' },
];

export default function TourOverlay() {
  const { tourActive, setTourActive } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [highlight, setHighlight] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = STEPS[step];

  function clearTimer() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function showOnCurrentPage() {
    clearTimer();
    timerRef.current = setTimeout(() => {
      const TW = Math.min(380, window.innerWidth - 32);

      if (!current.selector) {
        setHighlight(null);
        setTooltipPos({ top: window.innerHeight / 2 - 120, left: (window.innerWidth - TW) / 2, width: TW });
        return;
      }

      const el = document.querySelector(current.selector);
      if (!el) {
        // Element not found — show centred anyway
        setHighlight(null);
        setTooltipPos({ top: window.innerHeight / 2 - 120, left: (window.innerWidth - TW) / 2, width: TW });
        return;
      }

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      timerRef.current = setTimeout(() => {
        const r = el.getBoundingClientRect();
        setHighlight(r);

        const cx = r.left + r.width / 2;
        let top = r.bottom + 14;
        if (top + 220 > window.innerHeight) top = Math.max(8, r.top - 220 - 14);
        const left = Math.max(8, Math.min(cx - TW / 2, window.innerWidth - TW - 8));
        setTooltipPos({ top, left, width: TW });
      }, 350);
    }, 400);
  }

  // Navigate or show when step changes
  useEffect(() => {
    if (!tourActive) return;
    clearTimer();
    setHighlight(null);
    setTooltipPos(null);

    if (pathname !== current.path) {
      router.push(current.path);
    } else {
      showOnCurrentPage();
    }
    return clearTimer;
  }, [step, tourActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show when navigation completes and we're on the right page
  useEffect(() => {
    if (!tourActive) return;
    if (pathname === current.path) {
      showOnCurrentPage();
    }
    return clearTimer;
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : close();
  const back = () => step > 0 && setStep(s => s - 1);
  const close = () => { setTourActive(false); setStep(0); setHighlight(null); setTooltipPos(null); clearTimer(); };

  if (!tourActive) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }} />

      {/* Spotlight */}
      {highlight && (
        <div style={{
          position: 'fixed',
          top: highlight.top - 5, left: highlight.left - 5,
          width: highlight.width + 10, height: highlight.height + 10,
          zIndex: 9001, borderRadius: 10, pointerEvents: 'none',
          boxShadow: '0 0 0 4px #6366f1, 0 0 0 9999px rgba(0,0,0,0.55)',
          animation: 'tpulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Tooltip */}
      {tooltipPos && (
        <div style={{
          position: 'fixed', top: tooltipPos.top, left: tooltipPos.left, width: tooltipPos.width,
          zIndex: 9002, background: '#0f0f1a', borderRadius: 14,
          border: '1px solid rgba(99,102,241,0.4)', padding: '16px 18px 14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          animation: 'tfadein 0.2s ease',
        }}>
          {/* Dots + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 12 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2, transition: 'all 0.3s',
                width: i === step ? 20 : 5,
                background: i < step ? '#6366f1' : i === step ? '#a855f7' : 'rgba(255,255,255,0.1)',
              }} />
            ))}
            <button onClick={close} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: '#475569', fontSize: 14, cursor: 'pointer', lineHeight: 1, padding: '0 2px',
            }}>✕</button>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{current.title}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>{current.desc}</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={back} disabled={step === 0} style={{
              padding: '5px 13px', borderRadius: 7, fontSize: 12,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: step === 0 ? '#1e293b' : '#64748b', cursor: step === 0 ? 'default' : 'pointer',
            }}>← Back</button>
            <span style={{ fontSize: 11, color: '#334155' }}>{step + 1} / {STEPS.length}</span>
            <button onClick={next} style={{
              padding: '5px 15px', borderRadius: 7, fontSize: 12, fontWeight: 700,
              background: step === STEPS.length - 1 ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#a855f7)',
              border: 'none', color: '#fff', cursor: 'pointer',
            }}>{step === STEPS.length - 1 ? '🎉 Done!' : 'Next →'}</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tpulse { 0%,100%{box-shadow:0 0 0 4px #6366f1,0 0 0 9999px rgba(0,0,0,0.55)} 50%{box-shadow:0 0 0 7px #a855f7,0 0 0 9999px rgba(0,0,0,0.55)} }
        @keyframes tfadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}
