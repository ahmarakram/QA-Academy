'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const STEPS = [
  { path: '/',               selector: '#tour-hero',          title: '🏠 Dashboard',         desc: 'Your command centre — tracks XP, streak, completed modules, and bugs found in real time.' },
  { path: '/',               selector: '#tour-stats',         title: '📊 Progress Stats',     desc: 'See how many modules you\'ve completed, total XP earned, bugs found, and badges unlocked.' },
  { path: '/',               selector: '#tour-quick-actions', title: '⚡ Quick Actions',       desc: 'Your launchpad — jump into modules, practice lab, quizzes, AI tutor, certifications, or capstone projects.' },
  { path: '/learning-path',  selector: null,                  title: '📚 Learning Path',      desc: '21 modules across 5 tracks: Core Testing, Automation, AI Quality Engineering, Specialised, and Leadership.' },
  { path: '/quiz',           selector: null,                  title: '🎯 Quiz Center',        desc: '100+ adaptive questions. Difficulty adjusts to your level and every wrong answer gets an AI explanation.' },
  { path: '/lab',            selector: null,                  title: '🔬 Practice Lab',       desc: 'Find hidden bugs in simulated real-world apps. Each bug found earns XP.' },
  { path: '/ai-tutor',       selector: null,                  title: '🤖 AI Tutor',           desc: 'Your 24/7 QA mentor powered by Llama 3.3 70B. Ask anything — explanations, test cases, career advice.' },
  { path: '/certifications', selector: null,                  title: '🏅 Certifications',     desc: 'Study guides and timed exam simulators for 19 industry certs — ISTQB, Playwright, AWS, Cypress, and more.' },
  { path: '/capstone',       selector: null,                  title: '🏆 Capstone Projects',  desc: '8 real-world QA workspaces: E-Commerce, SaaS, HealthTech, FinTech, AI Chatbot, RAG, Agentic AI, MCP.' },
  { path: '/cv-writer',      selector: null,                  title: '📄 CV Writer',          desc: 'Generate a professional QA CV tailored to your level and target role using your platform progress.' },
];

type Rect = { top: number; left: number; width: number; height: number };

export default function TourOverlay() {
  const { tourActive, setTourActive, tourStep: step, setTourStep: setStep } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [spotRect, setSpotRect] = useState<Rect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  useEffect(() => {
    if (!tourActive) return;
    clearTimer();
    setSpotRect(null);
    setTooltipStyle(null);

    const s = STEPS[step];

    // Navigate if on wrong page — effect re-runs when pathname updates
    if (pathname !== s.path) {
      router.push(s.path);
      return;
    }

    // On correct page — wait for render then position
    timerRef.current = setTimeout(() => {
      const TW = Math.min(380, window.innerWidth - 32);

      if (!s.selector) {
        setSpotRect(null);
        setTooltipStyle({ top: window.innerHeight / 2 - 120, left: (window.innerWidth - TW) / 2, width: TW });
        return;
      }

      const el = document.querySelector(s.selector);
      if (!el) {
        setSpotRect(null);
        setTooltipStyle({ top: window.innerHeight / 2 - 120, left: (window.innerWidth - TW) / 2, width: TW });
        return;
      }

      el.scrollIntoView({ behavior: 'instant', block: 'center' });

      timerRef.current = setTimeout(() => {
        const r = el.getBoundingClientRect();
        const PAD = 8;
        const sr: Rect = { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 };
        setSpotRect(sr);

        // Position tooltip — prefer below, fall back above
        const cx = r.left + r.width / 2;
        let top = r.bottom + PAD + 14;
        if (top + 200 > window.innerHeight) top = Math.max(8, r.top - 200 - PAD - 14);
        const left = Math.max(8, Math.min(cx - TW / 2, window.innerWidth - TW - 8));
        setTooltipStyle({ top, left, width: TW });
      }, 400);
    }, 380);

    return clearTimer;
  }, [step, tourActive, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => step < STEPS.length - 1 ? setStep(step + 1) : close();
  const back = () => step > 0 ? setStep(step - 1) : undefined;
  const close = () => { setTourActive(false); setStep(0); clearTimer(); router.push('/'); };

  if (!tourActive) return null;

  return (
    <>
      {/*
        Click-to-close layer — transparent, full screen, lowest z-index.
        Tooltip sits above this so its clicks never reach here.
      */}
      <div
        onClick={close}
        style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'transparent', cursor: 'default' }}
      />

      {/*
        Spotlight — pointer-events: none so it never intercepts clicks.
        box-shadow spreads a dark overlay OUTWARD from the element,
        leaving the element itself fully unobscured.
      */}
      {spotRect ? (
        <div style={{
          position: 'fixed',
          top: spotRect.top, left: spotRect.left,
          width: spotRect.width, height: spotRect.height,
          zIndex: 9001,
          pointerEvents: 'none',
          borderRadius: 12,
          boxShadow: '0 0 0 4px #6366f1, 0 0 0 9999px rgba(0,0,0,0.72)',
          animation: 'tring 2s ease-in-out infinite',
        }} />
      ) : (
        /* No specific element — just a dark overlay */
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9001,
          background: 'rgba(0,0,0,0.65)', pointerEvents: 'none',
        }} />
      )}

      {/* Tooltip — highest z-index, receives all clicks */}
      {tooltipStyle && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed', top: tooltipStyle.top, left: tooltipStyle.left, width: tooltipStyle.width,
            zIndex: 9002,
            background: '#0f0f1a',
            borderRadius: 14,
            border: '1px solid rgba(99,102,241,0.5)',
            padding: '16px 18px 14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 0 1px rgba(99,102,241,0.15)',
            animation: 'tfadein 0.22s ease',
          }}
        >
          {/* Progress dots + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 12 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2, transition: 'all 0.3s', flexShrink: 0,
                width: i === step ? 20 : 5,
                background: i < step ? '#6366f1' : i === step ? '#a855f7' : 'rgba(255,255,255,0.12)',
              }} />
            ))}
            <button
              onClick={e => { e.stopPropagation(); close(); }}
              style={{
                marginLeft: 'auto', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
                width: 22, height: 22, cursor: 'pointer', color: '#64748b',
                fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>✕</button>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
            {STEPS[step].title}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65, marginBottom: 14 }}>
            {STEPS[step].desc}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={e => { e.stopPropagation(); back(); }}
              disabled={step === 0}
              style={{
                padding: '5px 13px', borderRadius: 7, fontSize: 12,
                cursor: step === 0 ? 'default' : 'pointer',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: step === 0 ? '#1e293b' : '#64748b',
              }}>← Back</button>

            <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>{step + 1} / {STEPS.length}</span>

            <button
              onClick={e => { e.stopPropagation(); next(); }}
              style={{
                padding: '5px 16px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                background: step === STEPS.length - 1
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : 'linear-gradient(135deg,#6366f1,#a855f7)',
                border: 'none', color: '#fff', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}>{step === STEPS.length - 1 ? '🎉 Done!' : 'Next →'}</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tring {
          0%,100% { box-shadow: 0 0 0 4px #6366f1, 0 0 0 9999px rgba(0,0,0,0.72); }
          50%      { box-shadow: 0 0 0 6px #a855f7, 0 0 0 9999px rgba(0,0,0,0.72); }
        }
        @keyframes tfadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}
