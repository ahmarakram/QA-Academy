'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';

// ─── Animation helpers ────────────────────────────────────────────────────────

function useAnimFrame(running: boolean) {
  const [frame, setFrame] = useState(0);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!running) return;
    ref.current = setTimeout(() => setFrame(f => f + 1), 80);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [frame, running]);
  return frame;
}

function useCycle(steps: number, msPerStep: number, running: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setStep(s => (s + 1) % steps), msPerStep);
    return () => clearInterval(t);
  }, [steps, msPerStep, running]);
  return step;
}

// ─── Individual animated demos ────────────────────────────────────────────────

function DemoAITutor({ active }: { active: boolean }) {
  const messages = [
    { role: 'user', text: "What's the difference between smoke and sanity testing?" },
    { role: 'bot', text: "Great question! Smoke testing is broad and shallow — run after every build. Sanity testing is narrow and deep — run after a specific fix." },
    { role: 'user', text: "Can you give me a real example?" },
    { role: 'bot', text: "Sure! Smoke: log in, open the dashboard, click main nav links. Sanity: after fixing the login bug, test only login flows deeply." },
  ];
  const step = useCycle(messages.length + 1, 2200, active);
  const visible = messages.slice(0, step);
  const typing = step < messages.length && messages[step]?.role === 'bot';

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>Alex · QA Mentor</div>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', marginLeft: 2, boxShadow: '0 0 6px #10b981' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '7px 10px', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#a855f7)' : '#1e1e30',
              color: '#e2e8f0', fontSize: 11, lineHeight: 1.5,
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: '#1e1e30', borderRadius: '12px 12px 12px 2px', width: 48 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: '#a5b4fc',
                animation: `bounce 0.9s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
        <span style={{ fontSize: 10, color: '#334155' }}>Ask Alex anything…</span>
      </div>
    </div>
  );
}

function DemoExam({ active }: { active: boolean }) {
  const step = useCycle(6, 1800, active);
  const answered = step >= 2;
  const correct = 1;
  const selected = 1;
  const showResult = step >= 4;

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, overflow: 'hidden', height: 220 }}>
      <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>🎓 ISTQB Foundation · Q12/50</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: step >= 3 ? '#f59e0b' : '#10b981', fontFamily: 'monospace' }}>{step >= 3 ? '⏱ 01:14' : '⏱ 78:42'}</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#a855f7)', width: '24%', transition: 'width 0.5s' }} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 10 }}>
          What is the primary purpose of regression testing?
        </div>
        {['Test brand-new features only', 'Ensure existing features still work after changes', 'Measure system performance', 'Check UI design consistency'].map((opt, i) => {
          let bg = 'rgba(255,255,255,0.04)';
          let border = 'rgba(255,255,255,0.08)';
          let color = '#94a3b8';
          if (answered) {
            if (i === correct) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.4)'; color = '#10b981'; }
            else if (i === selected && selected !== correct) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.35)'; color = '#ef4444'; }
          } else if (i === selected && step === 1) { bg = 'rgba(99,102,241,0.2)'; border = 'rgba(99,102,241,0.5)'; color = '#a5b4fc'; }
          return (
            <div key={i} style={{
              padding: '6px 10px', marginBottom: 5, borderRadius: 7, fontSize: 11,
              background: bg, border: `1px solid ${border}`, color, display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.3s',
            }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {answered && i === correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
            </div>
          );
        })}
      </div>
      {showResult && (
        <div style={{ margin: '0 14px', padding: '8px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 10, color: '#a5b4fc', lineHeight: 1.5 }}>
          💡 Regression testing re-runs existing tests after any code change to ensure previously working features aren&apos;t broken.
        </div>
      )}
    </div>
  );
}

function DemoCertificate({ active }: { active: boolean }) {
  const step = useCycle(4, 2000, active);
  const showCert = step >= 2;

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {!showCert ? (
        <>
          <div style={{ textAlign: 'center', padding: 8 }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{step === 0 ? '📝' : '🏆'}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: step === 1 ? '#10b981' : '#f1f5f9' }}>
              {step === 0 ? 'Exam in Progress…' : 'You Passed! 🎉'}
            </div>
            {step === 1 && <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981', margin: '6px 0' }}>84%</div>}
            {step === 1 && <div style={{ fontSize: 11, color: '#64748b' }}>42/50 correct · 14% above pass mark</div>}
          </div>
          {step === 1 && (
            <div style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: 8, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              🎓 Get My Certificate
            </div>
          )}
        </>
      ) : (
        <div style={{
          background: 'linear-gradient(145deg,#fff,#f8f4ff)', borderRadius: 10, padding: '12px 16px',
          border: '3px solid transparent', backgroundClip: 'padding-box',
          boxShadow: '0 0 0 2px #6366f1, 0 8px 24px rgba(99,102,241,0.3)',
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          animation: 'certAppear 0.4s ease',
        }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)', borderRadius: 2, width: '100%', marginBottom: 10 }} />
          <div style={{ fontSize: 22, marginBottom: 4 }}>🧪</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase' }}>QA Academy · Certificate of Achievement</div>
          <div style={{ fontSize: 10, color: '#475569', margin: '4px 0' }}>This certifies that</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1e1b4b', borderBottom: '2px solid #6366f1', paddingBottom: 2 }}>
            {step === 2 ? 'Your Name' : 'Alex Johnson'}
          </div>
          <div style={{ fontSize: 10, color: '#475569', margin: '6px 0 2px' }}>has successfully completed</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#312e81', background: 'rgba(99,102,241,0.08)', padding: '4px 10px', borderRadius: 6 }}>
            ISTQB Foundation Level
          </div>
          <div suppressHydrationWarning style={{ fontSize: 9, color: '#94a3b8', marginTop: 6 }}>Score: 84% · {new Date().toLocaleDateString('en-US')}</div>
        </div>
      )}
    </div>
  );
}

function DemoLearningPath({ active }: { active: boolean }) {
  const step = useCycle(5, 1600, active);
  const modules = [
    { id: 1, title: 'SDLC & STLC Fundamentals', track: 'Core', pct: step >= 2 ? 100 : step === 1 ? 60 : 0, done: step >= 2 },
    { id: 2, title: 'Test Design Techniques', track: 'Core', pct: step >= 4 ? 45 : 0, done: false },
    { id: 3, title: 'API Testing Mastery', track: 'Automation', pct: 0, done: false },
  ];

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>📚 Learning Path</span>
        <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>✨ {step >= 2 ? 150 : step >= 1 ? 90 : 0} XP earned</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {modules.map((m, i) => (
          <div key={m.id} style={{
            padding: '10px 12px', borderRadius: 10,
            background: i === 0 && step === 1 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${m.done ? 'rgba(16,185,129,0.4)' : i === 0 && step === 1 ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
            transition: 'all 0.4s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: m.done ? '#10b981' : '#e2e8f0' }}>{m.done ? '✓ ' : ''}{m.title}</span>
              <span style={{ fontSize: 10, color: '#475569' }}>{m.pct}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${m.pct}%`, background: m.done ? '#10b981' : 'linear-gradient(90deg,#6366f1,#a855f7)', transition: 'width 0.8s ease', borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
      {step >= 2 && (
        <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 10, color: '#10b981', textAlign: 'center' }}>
          🏅 Badge unlocked: SDLC Master!
        </div>
      )}
    </div>
  );
}

function DemoQuiz({ active }: { active: boolean }) {
  const step = useCycle(5, 1800, active);

  const opts = ['Exploratory Testing', 'Regression Testing', 'Unit Testing', 'Performance Testing'];
  const correct = 1;
  const selected = step >= 2 ? 1 : null;

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {['Easy', 'Medium', 'Hard'].map((d, i) => (
          <div key={d} style={{
            padding: '3px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700,
            background: i === 1 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
            color: i === 1 ? '#f59e0b' : '#475569',
            border: i === 1 ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.06)',
          }}>{d}</div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6366f1', fontWeight: 700 }}>Q3 of 10</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 10 }}>
        Which testing type re-runs after every code change?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {opts.map((opt, i) => {
          let style: React.CSSProperties = { padding: '7px 10px', borderRadius: 8, fontSize: 11, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.3s' };
          if (selected !== null) {
            if (i === correct) { style = { ...style, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981' }; }
            else if (i === selected && selected !== correct) { style = { ...style, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }; }
          }
          return (
            <div key={i} style={style}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>{String.fromCharCode(65+i)}</span>
              {opt}
              {selected !== null && i === correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
            </div>
          );
        })}
      </div>
      {step >= 3 && (
        <div style={{ marginTop: 8, padding: '5px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', fontSize: 10, color: '#a5b4fc' }}>
          💡 Regression testing verifies that existing features still work after changes.
        </div>
      )}
    </div>
  );
}

function DemoInterviewPrep({ active }: { active: boolean }) {
  const step = useCycle(6, 1600, active);
  const answerText = "I would use boundary value analysis and equivalence partitioning. BVA tests at edges, EP divides inputs into classes...";
  const typedLen = Math.min(answerText.length, (step) * 22);

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>💼 Senior QA Engineer · Interview Mode</div>
      <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: 11, color: '#a5b4fc', lineHeight: 1.5 }}>
        How would you design a test strategy for a login form with multiple input types?
      </div>
      <div style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: '#94a3b8', lineHeight: 1.6 }}>
        {answerText.substring(0, typedLen)}
        {typedLen < answerText.length && <span style={{ borderRight: '1px solid #6366f1', marginLeft: 1, animation: 'blink 1s infinite' }}>&nbsp;</span>}
      </div>
      {step >= 5 && (
        <div style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 10, color: '#10b981' }}>
          ⭐ Score: 8/10 — Strong! Mention negative tests and security edge cases to make it a 10.
        </div>
      )}
    </div>
  );
}

function DemoLab({ active }: { active: boolean }) {
  const step = useCycle(5, 1800, active);

  const bugs = [
    { id: 'BUG-001', title: 'Login accepts empty password', severity: 'Critical', found: step >= 1 },
    { id: 'BUG-003', title: 'Cart total overflows on discount', severity: 'High', found: step >= 3 },
    { id: 'BUG-007', title: 'Profile image upload has no size limit', severity: 'Medium', found: false },
  ];

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>🔬 Bug Hunt Lab</span>
        <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>{bugs.filter(b => b.found).length}/10 found</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {bugs.map(b => (
          <div key={b.id} style={{
            padding: '8px 10px', borderRadius: 8,
            background: b.found ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${b.found ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.4s',
          }}>
            <span style={{ fontSize: 14 }}>{b.found ? '🐛' : '❓'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: b.found ? '#e2e8f0' : '#475569' }}>{b.found ? b.title : '??? Hidden bug'}</div>
              <div style={{ fontSize: 9, color: b.severity === 'Critical' ? '#ef4444' : b.severity === 'High' ? '#f59e0b' : '#94a3b8', marginTop: 1 }}>
                {b.found ? b.severity : ''}
              </div>
            </div>
            {b.found && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>Found!</span>}
          </div>
        ))}
      </div>
      {step >= 2 && (
        <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 10, color: '#f59e0b', textAlign: 'center' }}>
          🏆 +50 XP for finding a Critical bug!
        </div>
      )}
    </div>
  );
}

function DemoPricing({ active }: { active: boolean }) {
  const step = useCycle(4, 2000, active);

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc', marginBottom: 10, textAlign: 'center' }}>💎 Academy Plans</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { name: 'Free', price: '$0', color: '#10b981', certs: '1 cert free', active: step < 2 },
          { name: 'Starter', price: '$9/mo', color: '#6366f1', certs: '5 certs/mo', active: step >= 2 },
          { name: 'Pro', price: '$19/mo', color: '#a855f7', certs: 'Unlimited', active: false },
          { name: 'Academy', price: '$29/mo', color: '#f59e0b', certs: '+ Mentoring', active: false },
        ].map(p => (
          <div key={p.name} style={{
            padding: '10px', borderRadius: 10, textAlign: 'center',
            background: p.active ? `${p.color}15` : 'rgba(255,255,255,0.03)',
            border: `${p.active ? '2px' : '1px'} solid ${p.active ? p.color + '66' : 'rgba(255,255,255,0.07)'}`,
            transition: 'all 0.4s',
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: p.color }}>{p.name}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#f1f5f9', margin: '2px 0' }}>{p.price}</div>
            <div style={{ fontSize: 9, color: '#64748b' }}>{p.certs}</div>
            {p.active && <div style={{ marginTop: 4, fontSize: 9, color: p.color, fontWeight: 700 }}>✓ Selected</div>}
          </div>
        ))}
      </div>
      {step >= 2 && (
        <div style={{ marginTop: 10, padding: '8px', borderRadius: 8, background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15))', border: '1px solid rgba(99,102,241,0.3)', textAlign: 'center', fontSize: 11, color: '#a5b4fc', fontWeight: 700 }}>
          ⬆️ Upgrading to Starter…
        </div>
      )}
    </div>
  );
}

function DemoSettings({ active }: { active: boolean }) {
  const step = useCycle(5, 1800, active);
  const keyText = 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const typedLen = Math.min(keyText.length, step * 8);

  return (
    <div style={{ background: '#0d0d1a', borderRadius: 12, padding: 14, height: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#a5b4fc' }}>⚙️ AI Settings</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Groq ⚡', 'OpenAI', 'Claude'].map((p, i) => (
          <div key={p} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: i === 0 ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.04)', color: i === 0 ? '#f97316' : '#475569', border: `1px solid ${i === 0 ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)'}` }}>{p}</div>
        ))}
      </div>
      <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${step >= 2 ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, fontSize: 10, color: step >= 1 ? '#10b981' : '#475569', fontFamily: 'monospace', transition: 'all 0.3s' }}>
        {keyText.substring(0, typedLen)}
        {typedLen < keyText.length && <span style={{ borderRight: '1px solid #6366f1' }}>&nbsp;</span>}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, padding: '7px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
          llama-3.3-70b
        </div>
        <div style={{ padding: '7px 14px', borderRadius: 8, background: step >= 3 ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', border: `1px solid ${step >= 3 ? 'rgba(16,185,129,0.4)' : 'rgba(99,102,241,0.3)'}`, fontSize: 10, fontWeight: 700, color: step >= 3 ? '#10b981' : '#a5b4fc', cursor: 'pointer', transition: 'all 0.4s' }}>
          {step >= 3 ? '✓ Connected!' : '🔌 Test'}
        </div>
      </div>
      {step >= 4 && (
        <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 10, color: '#10b981' }}>
          ✅ API key saved! AI Tutor is now powered by Llama 3.3 70B
        </div>
      )}
    </div>
  );
}

// ─── Feature data ─────────────────────────────────────────────────────────────

interface Feature {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  href: string;
  Demo: React.FC<{ active: boolean }>;
  steps: string[];
  tips: string[];
  shortcut?: string;
}

const FEATURES: Feature[] = [
  {
    id: 'learning',
    icon: '📚',
    title: 'Learning Path',
    subtitle: '27 modules from Beginner to AI Quality Engineer',
    color: '#6366f1',
    href: '/learning-path',
    Demo: DemoLearningPath,
    steps: [
      'Go to Learning Path in the sidebar',
      'Filter by your level or topic track',
      'Click any module card to open it',
      'Read the content, run code examples in the built-in lab',
      'Complete the module quiz to earn XP and unlock the next',
      'Track your progress in the sidebar XP bar',
    ],
    tips: [
      'Start with Core modules even if you\'re advanced — good for filling gaps',
      'The "AI Builder" track (modules 22-27) is the most advanced — do it last',
      'Modules unlock badges which appear in your sidebar profile',
    ],
  },
  {
    id: 'tutor',
    icon: '🤖',
    title: 'AI Tutor',
    subtitle: 'Chat with Alex — your human-like QA mentor',
    color: '#a855f7',
    href: '/ai-tutor',
    Demo: DemoAITutor,
    steps: [
      'Click AI Tutor in the sidebar',
      'Alex greets you — just type your question naturally',
      'Switch modes: Tutor (learn), Test Generator (create test cases), Code Review, or Interview Prep',
      'Add a Groq API key in Settings for the best AI responses (free)',
      'Without an API key, the offline agent answers common QA questions',
      'Use quick-reply chips at the bottom for instant prompts',
    ],
    tips: [
      'Ask Alex to "generate test cases for a login form" in Test Generator mode',
      'In Interview mode, type your answer and Alex scores it 1-10',
      'Export the chat with the download button to save your session',
      'Groq API is completely free — get your key at console.groq.com',
    ],
    shortcut: 'Quick: click AI Tutor float button (bottom right) from any page',
  },
  {
    id: 'exam',
    icon: '🎓',
    title: 'Certification Exams',
    subtitle: '50 real MCQ questions · 90 min · Earn a certificate',
    color: '#10b981',
    href: '/certifications',
    Demo: DemoExam,
    steps: [
      'Go to Certifications Hub in the sidebar',
      'Browse 19 certifications — filter by category or difficulty',
      'Click a certification card to see full details',
      'Click "Take Certification Exam" (green button)',
      'Read the exam rules — you get 50 questions, 90 minutes, pass at 70%',
      'Enter your name (it appears on your certificate)',
      'Answer each question — explanation shown after every answer',
      'On passing, click "Get My Certificate" — then Print/Save as PDF',
    ],
    tips: [
      'Your FIRST certificate is always free — no payment needed',
      'Each exam draws from a 60-question pool so retakes feel different',
      'Questions show difficulty (🟢/🟡/🔴) — harder ones are worth more prep time',
      'Upgrade to Pro on the Pricing page for unlimited certificates',
    ],
  },
  {
    id: 'quiz',
    icon: '🎯',
    title: 'Quiz Center',
    subtitle: 'Quick-fire knowledge checks with AI explanations',
    color: '#f59e0b',
    href: '/quiz',
    Demo: DemoQuiz,
    steps: [
      'Open Quiz Center from the sidebar',
      'Select a topic area or difficulty level',
      'Answer each multiple-choice question',
      'After each answer, see if you were right and read the explanation',
      'Complete the quiz to see your total score',
      'Wrong answers are reviewed at the end for learning',
    ],
    tips: [
      'Quiz Center uses the same question bank as the certification exams — great practice',
      'With a Groq API key set, Alex gives you an expanded AI explanation after each answer',
      'Aim for 80%+ before attempting the full certification exam',
    ],
  },
  {
    id: 'lab',
    icon: '🔬',
    title: 'Practice Lab',
    subtitle: 'Find real bugs in intentionally broken apps',
    color: '#ef4444',
    href: '/lab',
    Demo: DemoLab,
    steps: [
      'Open Practice Lab in the sidebar',
      'Read the scenario — each lab has a buggy app description',
      'Explore the described features and find hidden bugs',
      'Click "Found a Bug!" when you spot one',
      'File a proper bug report (title, steps, expected, actual, severity)',
      'Earn XP for each bug found — critical bugs give bonus XP',
    ],
    tips: [
      'There are 10 hidden bugs per lab — try to find them all',
      'Use systematic approaches: boundary values, negative tests, edge cases',
      'Your bug reports are scored — detailed reports with steps-to-reproduce earn more XP',
    ],
  },
  {
    id: 'interview',
    icon: '💼',
    title: 'Interview Prep',
    subtitle: 'Practice real QA interview questions with AI feedback',
    color: '#ec4899',
    href: '/interview-prep',
    Demo: DemoInterviewPrep,
    steps: [
      'Open Interview Prep from the sidebar',
      'Choose your experience level (Junior / Mid / Senior / Lead)',
      'Filter by company type or country if needed',
      'Read the question — take a moment to think',
      'Type your answer in the text box',
      'Click Submit Answer to get AI feedback (score + specific improvements)',
      'Compare your answer with the model answer',
    ],
    tips: [
      'Use STAR format for behavioural questions (Situation, Task, Action, Result)',
      'The AI scores your answer 1-10 and tells you exactly what top candidates say',
      'Practice the same question 3 times until you score 9+ consistently',
      'Real interview questions from FAANG, consulting firms, and startups are included',
    ],
  },
  {
    id: 'pricing',
    icon: '💎',
    title: 'Plans & Pricing',
    subtitle: 'Free first cert · Starter $9 · Pro $19 · Academy $29',
    color: '#6366f1',
    href: '/pricing',
    Demo: DemoPricing,
    steps: [
      'Open Plans & Pricing from the sidebar',
      'Your current plan is highlighted — Free by default',
      'Compare plans — hover each card to see all features',
      'Toggle Monthly/Yearly to see the 20% annual discount',
      'Click the plan button to upgrade',
      'View your earned certificates at the bottom of the page',
    ],
    tips: [
      'Start with the Free plan — your first certification exam is completely free',
      'Upgrade to Starter ($9/mo) when you need more than 1 certificate per month',
      'Yearly billing saves you 20% — equivalent to 2.4 months free',
      'All earned certificates are yours forever even if you downgrade later',
    ],
  },
  {
    id: 'settings',
    icon: '⚙️',
    title: 'AI Settings',
    subtitle: 'Connect Groq, OpenAI, or Claude for full AI power',
    color: '#f97316',
    href: '/settings',
    Demo: DemoSettings,
    steps: [
      'Open AI Settings from the sidebar',
      'Click the ? button next to "AI API Key" for a step-by-step provider guide',
      'Choose your provider: Groq (free & fast), OpenAI, or Anthropic Claude',
      'Paste your API key in the input field',
      'Select a model from the dropdown',
      'Click Test to verify the connection',
      'Click Save — the AI Tutor now uses your key',
    ],
    tips: [
      'Groq is completely free — 14,400 requests/day at GPT-4 speed (recommended to start)',
      'The ? help button shows exactly how to get each provider\'s API key step-by-step',
      'Your API key is stored locally only — never sent to any QA Academy server',
      'Without an API key the offline agent still answers most common QA questions',
    ],
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuidePage() {
  const [active, setActive] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = FEATURES.filter(f =>
    !search ||
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes certAppear {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .feature-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99,102,241,0.4) !important;
        }
      `}</style>

      <div className="page-content" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
          <h1 style={{ margin: '0 0 10px', fontSize: 30, fontWeight: 900, color: '#f1f5f9' }}>
            How to Use QA Academy
          </h1>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 15, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Click any feature to see an animated demo and get a step-by-step guide for every part of the platform.
          </p>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search features…"
            style={{
              padding: '10px 18px', borderRadius: 30, fontSize: 14,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#e2e8f0', outline: 'none', width: 280, textAlign: 'center',
            }}
          />
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 48 }}>
          {filtered.map(f => (
            <FeatureCard
              key={f.id}
              feature={f}
              isOpen={active === f.id}
              onToggle={() => setActive(active === f.id ? null : f.id)}
            />
          ))}
        </div>

        {/* Quick reference */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
            ⌨️ Keyboard Shortcuts
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {[
              { key: '⌘K / Ctrl+K', action: 'Open search' },
              { key: 'Enter', action: 'Send chat message' },
              { key: 'Shift+Enter', action: 'New line in chat' },
              { key: 'Esc', action: 'Close any modal' },
              { key: '?', action: 'Show API key guide (Settings)' },
              { key: 'Tab', action: 'Navigate between options' },
            ].map(s => (
              <div key={s.key} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <kbd style={{
                  padding: '3px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace',
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#a5b4fc', fontWeight: 700,
                }}>{s.key}</kbd>
                <span style={{ fontSize: 12, color: '#64748b' }}>{s.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
            ❓ Common Questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { q: 'Do I need an API key to use the AI Tutor?', a: 'No — the offline agent answers common QA questions without any key. For unlimited, human-like answers add a free Groq key in Settings.' },
              { q: 'How many certificates can I earn for free?', a: 'One certificate is always free. Upgrade to Starter ($9/mo) for 5 per month, or Pro ($19/mo) for unlimited.' },
              { q: 'Is my API key stored securely?', a: 'Your API key is stored only in your browser\'s localStorage. It never leaves your device — we have no server that receives it.' },
              { q: 'Can I retake a certification exam?', a: 'Yes, as many times as you like. Each attempt uses one of your monthly certificate slots (only if you pass and claim the certificate).' },
              { q: 'What happens to my progress if I clear my browser?', a: 'Progress is stored in localStorage. Clearing it resets progress. User accounts with cloud sync are planned for a future update.' },
              { q: 'Which AI model should I use with Groq?', a: 'Llama 3.3 70B Versatile (default) gives the best responses. Llama 3.1 8B is faster but less detailed — good for quick answers.' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '14px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>{item.q}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}

// ─── Feature card with animated demo ─────────────────────────────────────────

function FeatureCard({ feature, isOpen, onToggle }: { feature: Feature; isOpen: boolean; onToggle: () => void }) {
  const { icon, title, subtitle, color, href, Demo, steps, tips, shortcut } = feature;

  return (
    <div
      className="feature-card"
      style={{
        borderRadius: 16, overflow: 'hidden',
        background: '#0d0d1a',
        border: `1px solid ${isOpen ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        transition: 'all 0.25s',
        cursor: 'pointer',
      }}
    >
      {/* Card header — always visible */}
      <div
        onClick={onToggle}
        style={{
          padding: '16px 18px',
          background: isOpen ? `${color}10` : 'transparent',
          borderBottom: isOpen ? `1px solid ${color}22` : '1px solid transparent',
          transition: 'all 0.25s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>{title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</div>
            </div>
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 2,
            background: isOpen ? `${color}22` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isOpen ? color + '44' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isOpen ? color : '#475569', fontSize: 13, transition: 'all 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}>▼</div>
        </div>

        {!isOpen && (
          <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
              background: `${color}12`, color: color,
              border: `1px solid ${color}25`,
            }}>
              {steps.length} steps
            </span>
            <span style={{
              padding: '3px 8px', borderRadius: 20, fontSize: 10,
              background: 'rgba(255,255,255,0.04)', color: '#64748b',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {tips.length} tips
            </span>
            <span style={{
              padding: '3px 8px', borderRadius: 20, fontSize: 10,
              background: 'rgba(99,102,241,0.1)', color: '#a5b4fc',
              border: '1px solid rgba(99,102,241,0.2)',
            }}>
              🎬 animated demo
            </span>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ padding: '16px 18px', animation: 'fadeInUp 0.2s ease' }}>
          {/* Animated demo */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Live Demo
            </div>
            <Demo active={isOpen} />
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>How to use it</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: `${color}18`, border: `1px solid ${color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: color,
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, paddingTop: 1 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Pro Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {tips.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 8, fontSize: 12,
                  background: `${color}08`, border: `1px solid ${color}18`, color: '#94a3b8', lineHeight: 1.5,
                }}>
                  <span style={{ color: color, flexShrink: 0 }}>💡</span>{t}
                </div>
              ))}
            </div>
          </div>

          {shortcut && (
            <div style={{ padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: '#64748b', marginBottom: 12 }}>
              ⌨️ {shortcut}
            </div>
          )}

          {/* Open feature button */}
          <a
            href={href}
            style={{
              display: 'block', padding: '10px', borderRadius: 10, textAlign: 'center', textDecoration: 'none',
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              color: '#fff', fontSize: 13, fontWeight: 700,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Open {title} →
          </a>
        </div>
      )}
    </div>
  );
}
