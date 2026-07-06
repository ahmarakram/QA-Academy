'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

interface TourStep {
  path: string;
  selector: string | null;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: TourStep[] = [
  {
    path: '/',
    selector: '#tour-hero',
    title: '🏠 Step 1 — Your Dashboard',
    description: 'This is your command centre. It tracks your XP, daily streak, completed modules, and bugs found — all updating in real time as you learn across the platform.',
    position: 'bottom',
  },
  {
    path: '/',
    selector: '#tour-level-badge',
    title: '🎯 Step 2 — Set Your Experience Level',
    description: 'Choose your current level — from Beginner to AI Quality Engineer. The platform adapts module recommendations, quiz difficulty, and AI tutor responses to match exactly where you are in your QA career.',
    position: 'right',
  },
  {
    path: '/',
    selector: '#tour-quick-actions',
    title: '⚡ Step 3 — Quick Actions',
    description: 'Your launchpad to every key feature. Click any card to jump into modules, the practice lab, quizzes, AI tutor, interview prep, certifications, capstone projects, or the jobs market.',
    position: 'top',
  },
  {
    path: '/learning-path',
    selector: null,
    title: '📚 Step 4 — Learning Path',
    description: '21 structured modules across 5 tracks: Core Testing, Automation, AI Quality Engineering, Specialised, and Leadership. Each module has guided content, quizzes, and hands-on exercises.',
    position: 'bottom',
  },
  {
    path: '/quiz',
    selector: null,
    title: '🎯 Step 5 — Quiz Center',
    description: '100+ adaptive questions covering every module topic. Quiz difficulty adjusts to your performance, and every wrong answer gets a full AI-powered explanation so you learn from mistakes.',
    position: 'bottom',
  },
  {
    path: '/lab',
    selector: null,
    title: '🔬 Step 6 — Practice Lab',
    description: 'Hunt for hidden bugs in real-world simulated apps — e-commerce, login flows, forms, and more. Each bug you find earns XP. This is the closest thing to real QA work on the platform.',
    position: 'bottom',
  },
  {
    path: '/ai-tutor',
    selector: null,
    title: '🤖 Step 7 — AI Tutor',
    description: 'Your 24/7 QA mentor powered by Llama 3.3 70B. Ask anything — get explanations, test case ideas, code review, career advice. Your full conversation history is saved between sessions.',
    position: 'bottom',
  },
  {
    path: '/interview-prep',
    selector: null,
    title: '💼 Step 8 — Interview Prep',
    description: 'Practice 53+ real QA interview questions with AI-powered feedback on your answers. Covers manual testing, automation, behavioural, and AI testing. Filter by role, country, and difficulty.',
    position: 'bottom',
  },
  {
    path: '/certifications',
    selector: null,
    title: '🏅 Step 9 — Certifications Hub',
    description: 'Study guides and timed exam simulators for 19 industry certs — ISTQB, Playwright, Cypress, AWS, Postman, and more. Each exam has per-question explanations and a full results breakdown.',
    position: 'bottom',
  },
  {
    path: '/capstone',
    selector: null,
    title: '🏆 Step 10 — Capstone Projects',
    description: 'Apply everything in 8 real-world QA workspaces: E-Commerce, SaaS, HealthTech, FinTech, AI Chatbot, RAG Pipeline, Agentic AI, and MCP testing — each with a simulated app, bug tracker, and test case manager.',
    position: 'bottom',
  },
];

interface TooltipPos {
  top: number;
  left: number;
  width: number;
}

function calcPos(el: Element | null, side: string): TooltipPos {
  const TW = Math.min(380, window.innerWidth - 32);
  const PAD = 14;
  if (!el) {
    return { top: window.innerHeight / 2 - 110, left: (window.innerWidth - TW) / 2, width: TW };
  }
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;

  if (side === 'bottom') {
    return { top: r.bottom + PAD, left: Math.max(8, Math.min(cx - TW / 2, window.innerWidth - TW - 8)), width: TW };
  }
  if (side === 'top') {
    return { top: Math.max(8, r.top - 220 - PAD), left: Math.max(8, Math.min(cx - TW / 2, window.innerWidth - TW - 8)), width: TW };
  }
  if (side === 'right' && r.right + TW + PAD < window.innerWidth) {
    return { top: Math.max(8, r.top - 10), left: r.right + PAD, width: TW };
  }
  // fallback centre
  return { top: window.innerHeight / 2 - 110, left: (window.innerWidth - TW) / 2, width: TW };
}

function waitForElement(selector: string, cb: (el: Element) => void, maxWait = 4000) {
  const el = document.querySelector(selector);
  if (el) { cb(el); return () => {}; }

  const observer = new MutationObserver(() => {
    const found = document.querySelector(selector);
    if (found) { observer.disconnect(); cb(found); }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const timeout = setTimeout(() => { observer.disconnect(); cb(document.body); }, maxWait);
  return () => { observer.disconnect(); clearTimeout(timeout); };
}

export default function TourOverlay() {
  const { tourActive, setTourActive } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const navDoneRef = useRef(false);

  const current = STEPS[step];

  const showTooltip = useCallback(() => {
    setVisible(false);
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }

    if (!current.selector) {
      // No specific element — centre on page
      setTimeout(() => {
        setHighlightRect(null);
        setPos(calcPos(null, 'bottom'));
        setVisible(true);
      }, 350);
      return;
    }

    const cleanup = waitForElement(current.selector, (el) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const fresh = document.querySelector(current.selector!);
        const target = fresh ?? el;
        setHighlightRect(target.getBoundingClientRect());
        setPos(calcPos(target, current.position ?? 'bottom'));
        setVisible(true);
      }, 300);
    });
    cleanupRef.current = cleanup;
  }, [current]);

  // When step changes: navigate if needed, then show tooltip automatically
  useEffect(() => {
    if (!tourActive) return;
    navDoneRef.current = false;
    setVisible(false);

    if (pathname !== current.path) {
      router.push(current.path);
    } else {
      showTooltip();
    }
  }, [step, tourActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // After navigation completes, auto-show tooltip
  useEffect(() => {
    if (!tourActive) return;
    if (pathname === current.path && !navDoneRef.current) {
      navDoneRef.current = true;
      showTooltip();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => () => { cleanupRef.current?.(); }, []);

  const goNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else close();
  };
  const goBack = () => { if (step > 0) setStep(s => s - 1); };
  const close = () => { setTourActive(false); setStep(0); setVisible(false); };

  if (!tourActive) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      />

      {/* Spotlight ring around target element */}
      {highlightRect && visible && (
        <div style={{
          position: 'fixed',
          top: highlightRect.top - 6,
          left: highlightRect.left - 6,
          width: highlightRect.width + 12,
          height: highlightRect.height + 12,
          zIndex: 9001,
          borderRadius: 10,
          pointerEvents: 'none',
          boxShadow: '0 0 0 4px #6366f1, 0 0 0 9999px rgba(0,0,0,0.6)',
          transition: 'all 0.3s ease',
          animation: 'tourPulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Tooltip card — auto-appears after navigation */}
      {pos && visible && (
        <div
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9002,
            background: 'linear-gradient(135deg, #0f0f1a 0%, #13132a 100%)',
            border: '1px solid rgba(99,102,241,0.45)',
            borderRadius: 16,
            padding: '18px 20px 16px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(99,102,241,0.1)',
            animation: 'fadeInUp 0.25s ease',
          }}
        >
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2, flexShrink: 0, transition: 'all 0.3s',
                width: i === step ? 22 : 6,
                background: i < step ? '#6366f1' : i === step ? '#a855f7' : 'rgba(255,255,255,0.1)',
              }} />
            ))}
            <button onClick={close} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
              width: 22, height: 22, cursor: 'pointer', color: '#475569',
              fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>✕</button>
          </div>

          <h3 style={{ margin: '0 0 7px', fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
            {current.title}
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65 }}>
            {current.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={goBack} disabled={step === 0} style={{
              padding: '6px 14px', borderRadius: 7, cursor: step === 0 ? 'default' : 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: step === 0 ? '#1e293b' : '#64748b', fontSize: 12, transition: 'all 0.15s',
            }}>← Back</button>

            <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>
              {step + 1} / {STEPS.length}
            </span>

            <button onClick={goNext} style={{
              padding: '6px 16px', borderRadius: 7, cursor: 'pointer',
              background: step === STEPS.length - 1
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', color: '#fff', fontSize: 12, fontWeight: 700,
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)', transition: 'all 0.15s',
            }}>
              {step === STEPS.length - 1 ? '🎉 Done!' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 4px #6366f1, 0 0 0 9999px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 0 7px #a855f7, 0 0 0 9999px rgba(0,0,0,0.6); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
