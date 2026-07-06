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
    title: '🏠 Step 1 — Dashboard',
    description: 'This is your command centre. It shows your XP, daily streak, completed modules, and bugs found. Everything you accomplish across the app is reflected here in real time.',
    position: 'bottom',
  },
  {
    path: '/',
    selector: '#tour-level-badge',
    title: '🎯 Step 2 — Set Your Level',
    description: 'Select your experience level — from Beginner to AI Quality Engineer. The platform adapts recommended modules, quiz difficulty, and AI tutor responses to match exactly where you are in your career.',
    position: 'right',
  },
  {
    path: '/learning-path',
    selector: null,
    title: '📚 Step 3 — Learning Path',
    description: 'Browse 21 structured modules grouped into 5 tracks: Core Testing, Automation, AI Quality Engineering, Specialised, and Leadership. Each module has video-style content, quizzes, and a practice exercise.',
    position: 'bottom',
  },
  {
    path: '/quiz',
    selector: null,
    title: '🎯 Step 4 — Quiz Center',
    description: 'Test your knowledge with 100+ adaptive questions. Quizzes cover every module topic and adjust difficulty based on your performance. Each wrong answer comes with a full AI-powered explanation.',
    position: 'bottom',
  },
  {
    path: '/lab',
    selector: null,
    title: '🔬 Step 5 — Practice Lab',
    description: 'Find hidden bugs in real-world simulated apps — an e-commerce store, a login flow, a form, and more. Each bug you find earns XP. This is the closest thing to real QA work on the platform.',
    position: 'bottom',
  },
  {
    path: '/ai-tutor',
    selector: null,
    title: '🤖 Step 6 — AI Tutor',
    description: 'Ask anything about software testing — your 24/7 QA mentor powered by Llama 3.3 70B. Get explanations, test case ideas, code review, and career advice. Your full conversation history is saved.',
    position: 'bottom',
  },
  {
    path: '/interview-prep',
    selector: null,
    title: '💼 Step 7 — Interview Prep',
    description: 'Practice 53+ real QA interview questions with AI-powered feedback on your answers. Covers manual testing, automation, behavioural, and AI testing questions. Filter by role, country, and difficulty.',
    position: 'bottom',
  },
  {
    path: '/certifications',
    selector: null,
    title: '🏅 Step 8 — Certifications Hub',
    description: 'Study guides and timed exam simulators for 19 industry certifications — ISTQB, Playwright, Cypress, AWS, Postman, and more. Each exam has per-question explanations and a results breakdown.',
    position: 'bottom',
  },
  {
    path: '/capstone',
    selector: null,
    title: '🏆 Step 9 — Capstone Projects',
    description: 'Apply everything in 8 real-world QA workspaces: E-Commerce, SaaS, HealthTech, FinTech, AI Chatbot, RAG Pipeline, Agentic AI, and MCP testing. Each workspace has a simulated app, bug tracker, and test case manager.',
    position: 'bottom',
  },
  {
    path: '/cv-writer',
    selector: null,
    title: '📄 Step 10 — CV / Resume Writer',
    description: 'Generate a professional QA CV tailored to your experience level and target role. The AI fills in your skills, tools, and achievements based on your platform progress. Export as a ready-to-send document.',
    position: 'bottom',
  },
];

interface TooltipPos {
  top: number;
  left: number;
  width: number;
  arrowSide: 'top' | 'bottom' | 'left' | 'right' | 'none';
}

function getTooltipPos(el: Element | null, preferredSide: string): TooltipPos {
  if (!el) return { top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 180, width: 360, arrowSide: 'none' };
  const r = el.getBoundingClientRect();
  const TW = Math.min(360, window.innerWidth - 32);
  const TH = 200;
  const PAD = 16;

  if (preferredSide === 'bottom' && r.bottom + TH + PAD < window.innerHeight) {
    return { top: r.bottom + PAD, left: Math.max(8, Math.min(r.left, window.innerWidth - TW - 8)), width: TW, arrowSide: 'top' };
  }
  if (preferredSide === 'top' && r.top - TH - PAD > 0) {
    return { top: r.top - TH - PAD, left: Math.max(8, Math.min(r.left, window.innerWidth - TW - 8)), width: TW, arrowSide: 'bottom' };
  }
  if (preferredSide === 'right' && r.right + TW + PAD < window.innerWidth) {
    return { top: Math.max(8, r.top), left: r.right + PAD, width: TW, arrowSide: 'left' };
  }
  // fallback: centre of screen
  return { top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - TW / 2, width: TW, arrowSide: 'none' };
}

export default function TourOverlay() {
  const { tourActive, setTourActive } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [highlight, setHighlight] = useState<DOMRect | null>(null);
  const [ready, setReady] = useState(false);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = STEPS[step];

  const positionTooltip = useCallback(() => {
    if (!current.selector) {
      setHighlight(null);
      setPos({ top: window.innerHeight / 2 - 120, left: window.innerWidth / 2 - 180, width: 360, arrowSide: 'none' });
      setReady(true);
      return;
    }
    const el = document.querySelector(current.selector);
    if (!el) {
      retryRef.current = setTimeout(positionTooltip, 300);
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const fresh = document.querySelector(current.selector!);
      if (fresh) {
        setHighlight(fresh.getBoundingClientRect());
        setPos(getTooltipPos(fresh, current.position ?? 'bottom'));
      }
      setReady(true);
    }, 400);
  }, [current]);

  // Navigate when step changes
  useEffect(() => {
    if (!tourActive) return;
    setReady(false);
    if (retryRef.current) clearTimeout(retryRef.current);
    if (pathname !== current.path) {
      router.push(current.path);
    } else {
      positionTooltip();
    }
  }, [step, tourActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // After navigation completes, position tooltip
  useEffect(() => {
    if (!tourActive || !ready) return;
  }, [pathname, tourActive]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!tourActive) return;
    if (pathname === current.path) {
      if (retryRef.current) clearTimeout(retryRef.current);
      positionTooltip();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); }
    else { setTourActive(false); setStep(0); }
  };
  const back = () => { if (step > 0) setStep(s => s - 1); };
  const close = () => { setTourActive(false); setStep(0); };

  if (!tourActive) return null;

  return (
    <>
      {/* Dark overlay */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(2px)',
      }} />

      {/* Highlight cutout */}
      {highlight && (
        <div style={{
          position: 'fixed',
          top: highlight.top - 6,
          left: highlight.left - 6,
          width: highlight.width + 12,
          height: highlight.height + 12,
          zIndex: 9001,
          borderRadius: 10,
          boxShadow: '0 0 0 4px #6366f1, 0 0 0 9999px rgba(0,0,0,0.65)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }} />
      )}

      {/* Tooltip card */}
      {pos && ready && (
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          zIndex: 9002,
          background: '#0f0f1a',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 16,
          padding: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.15)',
          animation: 'fadeInUp 0.2s ease',
        }}>
          {/* Step counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 3, borderRadius: 2, transition: 'all 0.3s',
                  width: i === step ? 20 : 6,
                  background: i <= step ? '#6366f1' : 'rgba(255,255,255,0.12)',
                }} />
              ))}
            </div>
            <button onClick={close} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, width: 24, height: 24, cursor: 'pointer',
              color: '#64748b', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
            {current.title}
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
            {current.description}
          </p>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={back} disabled={step === 0} style={{
              padding: '7px 16px', borderRadius: 8, cursor: step === 0 ? 'default' : 'pointer',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: step === 0 ? '#334155' : '#64748b', fontSize: 13, transition: 'all 0.15s',
            }}>← Back</button>
            <span style={{ fontSize: 11, color: '#334155' }}>{step + 1} / {STEPS.length}</span>
            <button onClick={next} style={{
              padding: '7px 18px', borderRadius: 8, cursor: 'pointer',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)', transition: 'all 0.15s',
            }}>
              {step === STEPS.length - 1 ? '🎉 Done!' : 'Next →'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
