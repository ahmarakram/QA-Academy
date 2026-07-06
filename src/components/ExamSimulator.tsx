'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/lib/store';
import { pickExamQuestions } from '@/lib/exam-questions';
import type { Question } from '@/lib/exam-questions';

interface Props {
  certName: string;
  onClose: () => void;
}

type Screen = 'gate' | 'name' | 'exam' | 'results' | 'certificate' | 'paywall';

const EXAM_DURATION = 90 * 60; // 90 minutes
const PASS_MARK = 70;

// Plans that allow more than 1 cert
const PLAN_CERT_LIMITS: Record<string, number> = {
  free: 1,
  starter: 5,
  pro: 999,
  academy: 999,
};

export default function ExamSimulator({ certName, onClose }: Props) {
  const { plan, earnedCerts, freeCertUsed, earnCert, markFreeCertUsed, addXP, awardBadge } = useStore();

  // Check if user can take this exam
  // Atomic check: free plan users get exactly 1 attempt (tracked by freeCertUsed OR having ≥1 earned cert)
  const alreadyEarned = earnedCerts.some(c => c.certName === certName);
  const limit = PLAN_CERT_LIMITS[plan] ?? 1;
  const freeSlotUsed = plan === 'free' && (freeCertUsed || earnedCerts.length >= 1);
  const canTake = alreadyEarned || (plan === 'free' ? !freeSlotUsed : earnedCerts.length < limit);

  const storeKey = `exam_state_${certName.replace(/\s+/g, '_')}`;

  const [screen, setScreen] = useState<Screen>(() => {
    if (!canTake) return 'paywall';
    try {
      const saved = sessionStorage.getItem(storeKey);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.screen === 'exam') return 'exam';
      }
    } catch {}
    return 'gate';
  });
  const [userName, setUserName] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storeKey);
      if (saved) return JSON.parse(saved).userName ?? '';
    } catch {}
    return '';
  });
  // Single call — both questions and answers derive from the same pool draw
  const [{ questions, answers: initAnswers }] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storeKey);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.questions?.length) return { questions: s.questions as Question[], answers: s.answers as (number | null)[] };
      }
    } catch {}
    const qs = pickExamQuestions(certName, 50);
    return { questions: qs, answers: Array<number | null>(qs.length).fill(null) };
  });
  const [current, setCurrent] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storeKey);
      if (saved) return JSON.parse(saved).current ?? 0;
    } catch {}
    return 0;
  });
  const [answers, setAnswers] = useState<(number | null)[]>(initAnswers);
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storeKey);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.screen === 'exam' && s.timeLeft > 0) return s.timeLeft as number;
      }
    } catch {}
    return EXAM_DURATION;
  });
  const [showExpl, setShowExpl] = useState(false);
  const [claimed, setClaimed] = useState(false); // guard against double-claim
  const certRef = useRef<HTMLDivElement>(null);

  // Persist exam progress to sessionStorage so navigation away doesn't lose work
  useEffect(() => {
    if (screen === 'exam') {
      try {
        sessionStorage.setItem(storeKey, JSON.stringify({ screen, userName, questions, answers, current, timeLeft }));
      } catch {}
    } else {
      try { sessionStorage.removeItem(storeKey); } catch {}
    }
  }, [screen, userName, questions, answers, current, timeLeft, storeKey]);

  const finish = useCallback(() => setScreen('results'), []);

  useEffect(() => {
    if (screen !== 'exam') return;
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) { clearInterval(t); finish(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen, finish]);

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= PASS_MARK;

  const handleAnswer = (optIdx: number) => {
    if (answers[current] !== null) return;
    const next = [...answers];
    next[current] = optIdx;
    setAnswers(next);
    setShowExpl(true);
  };

  const handleNext = () => {
    setShowExpl(false);
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      finish();
    }
  };

  const handleClaimCert = () => {
    if (!passed || claimed) return; // guard against double-click / double-invoke
    setClaimed(true);
    const cert = {
      certName,
      score,
      total: questions.length,
      pct,
      earnedAt: new Date().toISOString(),
      userName: userName || 'QA Professional',
    };
    // Atomic: both store updates happen in one render cycle via earnCert which also sets freeCertUsed
    earnCert(cert);
    markFreeCertUsed(); // always mark used — store already guards against re-marking
    addXP(500);
    awardBadge(`cert:${certName}`);
    setScreen('certificate');
  };

  const handlePrint = () => {
    const el = certRef.current;
    if (!el) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Certificate — ${certName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
        body { margin: 0; background: #fff; }
      </style>
      </head><body>${el.innerHTML}</body></html>
    `);
    w.document.close();
    w.focus();
    // Wait for the popup's load event instead of a fixed timeout
    w.addEventListener('load', () => w.print());
    // Fallback for browsers that fire load before we attach the listener
    setTimeout(() => { try { w.print(); } catch { /* already printed */ } }, 1200);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const timerColor = timeLeft < 120 ? '#ef4444' : timeLeft < 300 ? '#f59e0b' : '#10b981';

  // ── PAYWALL ──────────────────────────────────────────────────────────────────
  if (screen === 'paywall') {
    return (
      <Overlay onClose={onClose}>
        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>Certificate Limit Reached</h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
            Your <strong style={{ color: '#a5b4fc' }}>Free</strong> plan includes 1 certificate.<br />
            Upgrade to earn more and get full academy access.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { name: 'Starter', price: '$9/mo', certs: '5 certificates', color: '#6366f1' },
              { name: 'Pro', price: '$19/mo', certs: 'Unlimited', color: '#a855f7' },
            ].map(p => (
              <div key={p.name} style={{
                padding: '16px', borderRadius: 12,
                background: `${p.color}12`, border: `1px solid ${p.color}44`,
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: p.color }}>{p.name}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', margin: '4px 0' }}>{p.price}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.certs}/month</div>
              </div>
            ))}
          </div>
          <a href="/pricing" style={{
            display: 'block', padding: '12px', borderRadius: 10, marginBottom: 10,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}>
            View All Plans →
          </a>
          <button onClick={onClose} style={{
            width: '100%', padding: '10px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
            color: '#64748b', fontSize: 13, cursor: 'pointer',
          }}>Close</button>
        </div>
      </Overlay>
    );
  }

  // ── GATE (info before starting) ───────────────────────────────────────────
  if (screen === 'gate') {
    const isFirst = !freeCertUsed && plan === 'free';
    return (
      <Overlay onClose={onClose}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎓</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>
            {certName}
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px' }}>Official Academy Certification Exam</p>

          {isFirst && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 20,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              fontSize: 13, color: '#10b981',
            }}>
              ✅ This is your <strong>free certificate</strong> — no payment required!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '📝', label: 'Questions', value: '50 MCQ' },
              { icon: '⏱️', label: 'Time Limit', value: '90 minutes' },
              { icon: '✅', label: 'Pass Mark', value: '70%' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '12px 8px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '14px 16px', borderRadius: 10, marginBottom: 24,
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
            textAlign: 'left', fontSize: 13, color: '#94a3b8', lineHeight: 1.7,
          }}>
            <strong style={{ color: '#a5b4fc' }}>Before you begin:</strong><br />
            • Choose the best answer for each question<br />
            • Explanation is shown after each answer<br />
            • You can't change an answer once selected<br />
            • Pass with 70% or above to earn your certificate<br />
            • Your certificate will include your name — enter it on the next screen
          </div>

          <button
            onClick={() => setScreen('name')}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff', fontSize: 15, fontWeight: 700,
            }}
          >
            Start Exam →
          </button>
          <button onClick={onClose} style={{
            width: '100%', marginTop: 8, padding: '10px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
            color: '#64748b', fontSize: 13, cursor: 'pointer',
          }}>Cancel</button>
        </div>
      </Overlay>
    );
  }

  // ── NAME ENTRY ────────────────────────────────────────────────────────────
  if (screen === 'name') {
    return (
      <Overlay onClose={onClose}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✍️</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Your Name on the Certificate</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px' }}>This name will appear on your official certificate</p>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="e.g. John Smith"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter' && userName.trim()) setScreen('exam'); }}
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 10, boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(99,102,241,0.4)',
              color: '#f1f5f9', fontSize: 16, outline: 'none', marginBottom: 16,
              textAlign: 'center', fontWeight: 600,
            }}
          />
          <button
            onClick={() => setScreen('exam')}
            disabled={!userName.trim()}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, cursor: userName.trim() ? 'pointer' : 'not-allowed', border: 'none',
              background: userName.trim() ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
              color: userName.trim() ? '#fff' : '#475569', fontSize: 15, fontWeight: 700,
              transition: 'all 0.2s',
            }}
          >
            Begin Exam →
          </button>
        </div>
      </Overlay>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'results') {
    return (
      <Overlay onClose={onClose} wide>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>{passed ? '🏆' : '📚'}</div>
          <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: passed ? '#10b981' : '#f59e0b' }}>
            {passed ? 'Congratulations! You Passed!' : 'Keep Studying'}
          </h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px' }}>
            {certName}
          </p>

          {/* Score ring */}
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 40px', borderRadius: 20, marginBottom: 20,
            background: passed ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
            border: `2px solid ${passed ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.35)'}`,
          }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: passed ? '#10b981' : '#f59e0b', lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 15, color: '#94a3b8', marginTop: 4 }}>{score}/{questions.length} correct</div>
            <div style={{ fontSize: 12, color: passed ? '#10b981' : '#64748b', marginTop: 4 }}>
              {passed ? `✓ Passed — ${pct - PASS_MARK}% above pass mark` : `✗ Need ${PASS_MARK - pct}% more to pass`}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Correct', value: score, color: '#10b981' },
              { label: 'Incorrect', value: questions.length - score, color: '#ef4444' },
              { label: 'Pass Mark', value: `${PASS_MARK}%`, color: '#6366f1' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '10px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Answer review - scrollable */}
          <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 20, textAlign: 'left' }}>
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div key={i} style={{
                  padding: '8px 12px', marginBottom: 5, borderRadius: 8,
                  background: correct ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${correct ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}`,
                  fontSize: 12,
                }}>
                  <span style={{ color: correct ? '#10b981' : '#ef4444', marginRight: 6, fontWeight: 700 }}>
                    {correct ? '✓' : '✗'}
                  </span>
                  <span style={{ color: '#94a3b8' }}>Q{i + 1}: {q.q.substring(0, 65)}…</span>
                  {!correct && (
                    <div style={{ color: '#64748b', marginTop: 3, marginLeft: 16, fontSize: 11 }}>
                      ✓ Correct: {q.options[q.answer]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {passed && (
              <button
                onClick={handleClaimCert}
                style={{
                  padding: '12px 28px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                }}
              >
                🎓 Get My Certificate
              </button>
            )}
            <button
              onClick={() => {
                setAnswers(Array(questions.length).fill(null));
                setCurrent(0);
                setTimeLeft(EXAM_DURATION);
                setShowExpl(false);
                setScreen('gate');
              }}
              style={{
                padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc', fontSize: 14, fontWeight: 600,
              }}
            >
              Retry Exam
            </button>
            <button onClick={onClose} style={{
              padding: '12px 20px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
              color: '#64748b', fontSize: 13, cursor: 'pointer',
            }}>Close</button>
          </div>
        </div>
      </Overlay>
    );
  }

  // ── CERTIFICATE ───────────────────────────────────────────────────────────
  if (screen === 'certificate') {
    const earnedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return (
      <Overlay onClose={onClose} wide>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Your Certificate is Ready! 🎉</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Print or save it as PDF from your browser</p>
        </div>

        {/* Certificate */}
        <div ref={certRef} style={{
          background: 'linear-gradient(145deg, #fff 0%, #f8f4ff 100%)',
          borderRadius: 16, overflow: 'hidden', marginBottom: 20,
          boxShadow: '0 20px 60px rgba(99,102,241,0.25)',
        }}>
          {/* Top border stripe */}
          <div style={{ height: 8, background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f59e0b)' }} />

          <div style={{ padding: '36px 48px 32px', fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🧪</div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#6366f1', marginBottom: 4, fontFamily: 'Arial, sans-serif',
              }}>QA Academy</div>
              <div style={{
                fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'Arial, sans-serif',
              }}>AI-Powered Quality Engineering</div>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'Arial, sans-serif', marginBottom: 8,
              }}>Certificate of Achievement</div>
              <div style={{
                fontSize: 13, color: '#475569', fontStyle: 'italic',
                fontFamily: 'Georgia, serif', marginBottom: 12,
              }}>This certifies that</div>
              <div style={{
                fontSize: 34, fontWeight: 700, color: '#1e1b4b',
                fontFamily: '"Playfair Display", Georgia, serif',
                borderBottom: '2px solid #6366f1', paddingBottom: 8, display: 'inline-block',
                minWidth: 300,
              }}>
                {userName || 'QA Professional'}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#475569', fontStyle: 'italic', fontFamily: 'Georgia, serif', marginBottom: 8 }}>
                has successfully completed the examination for
              </div>
              <div style={{
                fontSize: 20, fontWeight: 700, color: '#312e81',
                fontFamily: 'Arial, sans-serif', padding: '10px 24px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))',
                borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)',
                display: 'inline-block',
              }}>
                {certName}
              </div>
            </div>

            {/* Score + date row */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 40,
              padding: '16px 24px', margin: '0 0 24px',
              background: 'rgba(99,102,241,0.04)', borderRadius: 10,
              border: '1px solid rgba(99,102,241,0.12)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#059669', fontFamily: 'Arial, sans-serif' }}>{pct}%</div>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>Final Score</div>
              </div>
              <div style={{ width: 1, background: '#e2e8f0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', fontFamily: 'Arial, sans-serif' }}>{score}/{questions.length}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>Correct Answers</div>
              </div>
              <div style={{ width: 1, background: '#e2e8f0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', fontFamily: 'Arial, sans-serif' }}>{earnedDate}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>Date Issued</div>
              </div>
            </div>

            {/* Signature area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 20, fontWeight: 700, color: '#4f46e5',
                  fontFamily: '"Brush Script MT", cursive, Georgia, serif',
                  borderBottom: '1px solid #94a3b8', paddingBottom: 4, marginBottom: 4, minWidth: 140,
                }}>QA Academy</div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}>Director of Education</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  border: '3px solid #6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                }}>
                  <div style={{ fontSize: 20 }}>🏅</div>
                  <div style={{ fontSize: 7, color: '#6366f1', fontWeight: 700, fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>VERIFIED</div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 20, fontWeight: 700, color: '#4f46e5',
                  fontFamily: '"Brush Script MT", cursive, Georgia, serif',
                  borderBottom: '1px solid #94a3b8', paddingBottom: 4, marginBottom: 4, minWidth: 140,
                }}>AI Quality Board</div>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}>Certification Authority</div>
              </div>
            </div>
          </div>

          {/* Bottom stripe */}
          <div style={{
            height: 6, background: 'linear-gradient(90deg, #f59e0b, #ec4899, #a855f7, #6366f1)',
          }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '12px 24px', borderRadius: 10, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff', fontSize: 14, fontWeight: 700,
            }}
          >
            🖨️ Print / Save PDF
          </button>
          <button onClick={onClose} style={{
            padding: '12px 20px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
            color: '#94a3b8', fontSize: 13, cursor: 'pointer',
          }}>Close</button>
        </div>
      </Overlay>
    );
  }

  // ── EXAM ───────────────────────────────────────────────────────────────────
  const q = questions[current];
  const answered = answers[current];
  const progressPct = ((current + (answered !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 700,
        background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 20, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          background: 'rgba(99,102,241,0.08)',
          borderBottom: '1px solid rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 18 }}>🎓</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {certName}
            </div>
            <div style={{ fontSize: 11, color: '#475569' }}>
              Q{current + 1} of {questions.length} · {questions[current]?.difficulty === 'hard' ? '🔴 Hard' : questions[current]?.difficulty === 'medium' ? '🟡 Medium' : '🟢 Easy'}
            </div>
          </div>
          <div style={{
            padding: '4px 14px', borderRadius: 20, fontWeight: 800, fontSize: 15,
            background: `${timerColor}18`, border: `1px solid ${timerColor}33`,
            color: timerColor, fontFamily: 'monospace', letterSpacing: '0.05em',
          }}>
            ⏱ {mins}:{secs}
          </div>
          <button
            onClick={() => { if (confirm('Exit exam? Progress will be lost.')) onClose(); }}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 7, width: 28, height: 28, cursor: 'pointer', color: '#64748b', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{
            height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            width: `${progressPct}%`, transition: 'width 0.4s',
          }} />
        </div>

        {/* Question */}
        <div style={{ padding: '24px 24px 16px' }}>
          <div style={{
            fontSize: 15, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.65,
            marginBottom: 20, minHeight: 60,
          }}>
            {q?.q}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {q?.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.04)';
              let border = 'rgba(255,255,255,0.08)';
              let color = '#94a3b8';
              if (answered !== null) {
                if (i === q.answer) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.4)'; color = '#10b981'; }
                else if (i === answered && answered !== q.answer) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.35)'; color = '#ef4444'; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered !== null}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 10,
                    cursor: answered !== null ? 'default' : 'pointer',
                    background: bg, border: `1px solid ${border}`, color, fontSize: 13,
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,255,255,0.06)', border: `1px solid ${border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {answered !== null && i === q.answer && <span>✓</span>}
                  {answered !== null && i === answered && answered !== q.answer && <span>✗</span>}
                </button>
              );
            })}
          </div>

          {showExpl && (
            <div style={{
              marginTop: 14, padding: '12px 16px', borderRadius: 10,
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              fontSize: 12, color: '#a5b4fc', lineHeight: 1.6,
            }}>
              <strong>💡 </strong>{q?.explanation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Dot progress */}
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 260 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i === current ? '#a5b4fc'
                  : answers[i] === null ? 'rgba(255,255,255,0.08)'
                  : answers[i] === questions[i].answer ? '#10b981' : '#ef4444',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          {answered !== null && (
            <button
              onClick={handleNext}
              style={{
                padding: '10px 22px', borderRadius: 10, cursor: 'pointer', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}
            >
              {current < questions.length - 1 ? 'Next →' : 'See Results →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable overlay ──────────────────────────────────────────────────────────
function Overlay({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: wide ? 660 : 480,
        background: '#0d0d1a', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 20, padding: 32,
      }}>
        {children}
      </div>
    </div>
  );
}
