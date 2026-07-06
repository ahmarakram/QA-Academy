'use client';

import { useState, lazy, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const AppTour = lazy(() => import('./AppTour'));

const levels = [
  { key: 'beginner', icon: '🌱', label: 'Beginner', desc: 'New to software testing' },
  { key: 'intermediate', icon: '🌿', label: 'Intermediate', desc: '1–2 years experience' },
  { key: 'advanced', icon: '⚡', label: 'Advanced', desc: '3–5 years experience' },
  { key: 'expert', icon: '🔥', label: 'Expert', desc: '5+ years, AI testing focus' },
  { key: 'lead', icon: '👑', label: 'QA Lead', desc: 'Leading a QA team' },
  { key: 'ai-engineer', icon: '🤖', label: 'AI Quality Eng', desc: 'AI/ML testing specialist' },
];

const goals = [
  { key: 'get-job', icon: '💼', label: 'Get a QA Job', path: '/learning-path' },
  { key: 'upskill', icon: '📈', label: 'Upskill & Grow', path: '/learning-path' },
  { key: 'ai-testing', icon: '🤖', label: 'Learn AI Testing', path: '/module/9' },
  { key: 'certify', icon: '🏅', label: 'Get Certified', path: '/certifications' },
  { key: 'interview', icon: '🎯', label: 'Ace Interviews', path: '/interview-prep' },
  { key: 'practice', icon: '🔬', label: 'Practice Labs', path: '/lab' },
];

export default function OnboardingWizard() {
  const { setLevel, completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [chosenLevel, setChosenLevel] = useState('beginner');
  const [chosenPath, setChosenPath] = useState('/learning-path');
  const [runTour, setRunTour] = useState(false);
  const router = useRouter();

  const selectGoal = (path: string) => {
    setLevel(chosenLevel as never);
    setChosenPath(path);
    setStep(3);
  };

  const startTour = () => {
    completeOnboarding();
    setRunTour(true);
  };

  const skipTour = () => {
    completeOnboarding();
    router.push(chosenPath);
  };

  const steps = [
    {
      title: "Welcome to QA Academy 🧪",
      subtitle: "The world's most comprehensive AI-powered QA learning platform. Let's personalise your experience in 2 quick steps.",
      content: null,
    },
    {
      title: "What's your experience level?",
      subtitle: "This personalises AI explanations, quiz difficulty, and your learning path.",
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {levels.map(l => (
            <button
              key={l.key}
              onClick={() => setChosenLevel(l.key)}
              style={{
                padding: '14px 12px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                background: chosenLevel === l.key ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${chosenLevel === l.key ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                color: chosenLevel === l.key ? '#a5b4fc' : '#94a3b8',
                transition: 'all 0.18s',
                transform: chosenLevel === l.key ? 'scale(1.02)' : 'scale(1)',
                boxShadow: chosenLevel === l.key ? '0 0 0 4px rgba(99,102,241,0.15)' : 'none',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{l.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{l.label}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>{l.desc}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your main goal?",
      subtitle: "We'll take you straight to the best starting point.",
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {goals.map(g => (
            <button
              key={g.key}
              onClick={() => selectGoal(g.path)}
              style={{
                padding: '18px 14px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#a5b4fc',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.2)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)';
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>{g.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{g.label}</div>
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[Math.min(step, 2)];

  if (runTour) {
    return (
      <Suspense fallback={null}>
        <AppTour onDone={() => { setRunTour(false); router.push(chosenPath); }} />
      </Suspense>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 580,
        background: '#0f0f1a', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 32px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)',
        animation: 'fadeInUp 0.35s ease',
      }}>
        {/* Progress dots */}
        <div style={{ padding: '20px 28px 0', display: 'flex', gap: 6, justifyContent: 'center' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              height: 4, borderRadius: 2, transition: 'all 0.3s',
              width: i === step ? 32 : 12,
              background: i <= step ? '#6366f1' : 'rgba(255,255,255,0.1)',
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '28px' }}>

          {/* Step 0 — Welcome */}
          {step === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🧪</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.2 }}>
                {current.title}
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>{current.subtitle}</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
                {['21 Modules', 'AI Tutor', '100+ Quizzes', 'Practice Labs', 'Cert Guides'].map(f => (
                  <span key={f} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12,
                    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                    color: '#a5b4fc',
                  }}>{f}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: '12px 28px', borderRadius: 12, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)', transition: 'all 0.18s',
                  }}
                >
                  Let&apos;s Start →
                </button>
                <button
                  onClick={() => completeOnboarding()}
                  style={{
                    padding: '12px 24px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#64748b', fontSize: 15, fontWeight: 500, transition: 'all 0.18s',
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* Steps 1 & 2 — level + goal */}
          {step > 0 && step < 3 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }}>{current.title}</h2>
              <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px' }}>{current.subtitle}</p>
              {current.content}
            </>
          )}

          {/* Step 3 — Tour offer */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: '0 0 10px' }}>
                Take a quick tour?
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: '0 0 28px' }}>
                We&apos;ll walk you through the key features in under 2 minutes — so you can get the most out of QA Academy from day one.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                <button
                  onClick={startTour}
                  style={{
                    width: 260, padding: '13px 28px', borderRadius: 12, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)', transition: 'all 0.18s',
                  }}
                >
                  🚀 Yes, show me around!
                </button>
                <button
                  onClick={skipTour}
                  style={{
                    width: 260, padding: '11px 24px', borderRadius: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#64748b', fontSize: 14, fontWeight: 500, transition: 'all 0.18s',
                  }}
                >
                  Skip tour, jump in
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — Back/Next only on steps 1–2 */}
        {step > 0 && step < 3 && (
          <div style={{
            padding: '16px 28px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                padding: '8px 18px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9,
                color: '#475569', fontSize: 13, cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: 14 }}
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
