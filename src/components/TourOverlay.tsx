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
  const { tourActive, setTourActive } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [spotRect, setSpotRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  // Single effect: navigate OR show tooltip depending on current path
  useEffect(() => {
    if (!tourActive) return;
    clearTimer();
    setSpotRect(null);
    setTooltipPos(null);

    const s = STEPS[step];

    // Wrong page — navigate first, this effect will re-run when pathname changes
    if (pathname !== s.path) {
      router.push(s.path);
      return;
    }

    // Correct page — wait for paint then position
    timerRef.current = setTimeout(() => {
      const TW = Math.min(380, window.innerWidth - 32);

      if (!s.selector) {
        setSpotRect(null);
        setTooltipPos({ top: window.innerHeight / 2 - 120, left: (window.innerWidth - TW) / 2, width: TW });
        return;
      }

      const el = document.querySelector(s.selector);
      if (!el) {
        // Element not found, show centred
        setSpotRect(null);
        setTooltipPos({ top: window.innerHeight / 2 - 120, left: (window.innerWidth - TW) / 2, width: TW });
        return;
      }

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Wait for scroll to settle, then measure
      timerRef.current = setTimeout(() => {
        const r = el.getBoundingClientRect();
        const PAD = 8;
        setSpotRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });

        // Position tooltip below or above
        const cx = r.left + r.width / 2;
        let top = r.bottom + PAD + 12;
        if (top + 220 > window.innerHeight) top = Math.max(8, r.top - 220 - PAD - 12);
        const left = Math.max(8, Math.min(cx - TW / 2, window.innerWidth - TW - 8));
        setTooltipPos({ top, left, width: TW });
      }, 380);
    }, 350);

    return clearTimer;
  }, [step, tourActive, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : close();
  const back = () => step > 0 ? setStep(s => s - 1) : undefined;
  const close = () => { setTourActive(false); setStep(0); clearTimer(); };

  if (!tourActive) return null;

  const GAP = 4;

  return (
    <>
      {/* 4-rectangle backdrop — creates a real cutout around spotRect */}
      {spotRect ? (
        <>
          {/* Top */}
          <div onClick={close} style={{ position: 'fixed', zIndex: 9000, background: 'rgba(0,0,0,0.7)',
            top: 0, left: 0, right: 0, height: spotRect.top - GAP, pointerEvents: 'all' }} />
          {/* Bottom */}
          <div onClick={close} style={{ position: 'fixed', zIndex: 9000, background: 'rgba(0,0,0,0.7)',
            top: spotRect.top - GAP + spotRect.height + GAP * 2, left: 0, right: 0, bottom: 0, pointerEvents: 'all' }} />
          {/* Left */}
          <div onClick={close} style={{ position: 'fixed', zIndex: 9000, background: 'rgba(0,0,0,0.7)',
            top: spotRect.top - GAP, left: 0, width: spotRect.left - GAP, height: spotRect.height + GAP * 2, pointerEvents: 'all' }} />
          {/* Right */}
          <div onClick={close} style={{ position: 'fixed', zIndex: 9000, background: 'rgba(0,0,0,0.7)',
            top: spotRect.top - GAP, left: spotRect.left - GAP + spotRect.width + GAP * 2, right: 0, height: spotRect.height + GAP * 2, pointerEvents: 'all' }} />

          {/* Spotlight border ring */}
          <div style={{
            position: 'fixed', zIndex: 9001, pointerEvents: 'none',
            top: spotRect.top - GAP, left: spotRect.left - GAP,
            width: spotRect.width + GAP * 2, height: spotRect.height + GAP * 2,
            borderRadius: 12, border: '2px solid #6366f1',
            boxShadow: '0 0 0 3px rgba(99,102,241,0.35), 0 0 20px rgba(99,102,241,0.5)',
            animation: 'tring 2s ease-in-out infinite',
          }} />
        </>
      ) : (
        /* Full backdrop when no specific element */
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }} />
      )}

      {/* Tooltip card */}
      {tooltipPos && (
        <div style={{
          position: 'fixed', top: tooltipPos.top, left: tooltipPos.left, width: tooltipPos.width,
          zIndex: 9002, background: '#0f0f1a', borderRadius: 14,
          border: '1px solid rgba(99,102,241,0.5)', padding: '16px 18px 14px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 0 1px rgba(99,102,241,0.15)',
          animation: 'tfadein 0.22s ease',
        }}>
          {/* Progress dots + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 12 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2, transition: 'all 0.3s', flexShrink: 0,
                width: i === step ? 20 : 5,
                background: i < step ? '#6366f1' : i === step ? '#a855f7' : 'rgba(255,255,255,0.12)',
              }} />
            ))}
            <button onClick={close} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, width: 22, height: 22, cursor: 'pointer', color: '#64748b',
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
            <button onClick={back} disabled={step === 0} style={{
              padding: '5px 13px', borderRadius: 7, fontSize: 12, cursor: step === 0 ? 'default' : 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: step === 0 ? '#1e293b' : '#64748b',
            }}>← Back</button>
            <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>{step + 1} / {STEPS.length}</span>
            <button onClick={next} style={{
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
          0%,100% { box-shadow: 0 0 0 3px rgba(99,102,241,0.35), 0 0 20px rgba(99,102,241,0.5); border-color: #6366f1; }
          50%      { box-shadow: 0 0 0 5px rgba(168,85,247,0.4), 0 0 28px rgba(168,85,247,0.6); border-color: #a855f7; }
        }
        @keyframes tfadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}
