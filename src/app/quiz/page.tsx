'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { quizBank, Question } from '@/lib/quiz-data';
import { useStore } from '@/lib/store';
import { askOfflineAgent } from '@/lib/offline-agent';
import { groqExplain } from '@/lib/groq';
import Link from 'next/link';

function QuizContent() {
  const searchParams = useSearchParams();
  const modParam = searchParams.get('module');
  const { level, recordQuiz, addXP, groqSettings } = useStore();

  const [selectedLevel, setSelectedLevel] = useState<string>(level === 'beginner' ? 'beginner' : level === 'intermediate' ? 'intermediate' : 'advanced');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);

  const startQuiz = () => {
    const pool = quizBank.filter(q =>
      q.level === selectedLevel || (modParam && q.moduleId === parseInt(modParam))
    );
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAiExplanation('');
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const getAiExplain = async () => {
    const q = questions[current];
    setExplainLoading(true);
    if (groqSettings.enabled && groqSettings.apiKey) {
      const text = await groqExplain(groqSettings.apiKey, groqSettings.model,
        `${q.question} — correct answer: ${q.options[q.correct]}. ${q.explanation}`, level);
      setAiExplanation(text);
    } else {
      await new Promise(r => setTimeout(r, 200));
      const result = askOfflineAgent(q.question, level);
      setAiExplanation(result.confidence > 0
        ? result.text
        : `## Explanation\n\n${q.explanation}\n\n**Correct answer:** ${q.options[q.correct]}\n\nThis tests your knowledge of ${q.level}-level QA concepts. Review Module ${q.moduleId} for more context.`
      );
    }
    setExplainLoading(false);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      recordQuiz({ moduleId: modParam ? parseInt(modParam) : 0, level: selectedLevel, score, total: questions.length, attemptedAt: new Date().toISOString() });
      addXP(score * 15);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setAiExplanation('');
    }
  };

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>🎯 Quiz Center</h1>
        <p style={{ color: '#94a3b8', marginBottom: 32 }}>Test your QA knowledge with adaptive questions</p>

        <div style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#e2e8f0' }}>Choose Quiz Level</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {[
              { key: 'beginner', icon: '🌱', label: 'Beginner', desc: 'Fundamentals & concepts' },
              { key: 'intermediate', icon: '🌿', label: 'Intermediate', desc: 'Applied knowledge' },
              { key: 'advanced', icon: '⚡', label: 'Advanced', desc: 'Complex scenarios' },
              { key: 'expert', icon: '🔥', label: 'Expert', desc: 'AI & deep technical' },
            ].map(l => (
              <button
                key={l.key}
                onClick={() => setSelectedLevel(l.key)}
                style={{
                  padding: '14px', borderRadius: 10, cursor: 'pointer',
                  background: selectedLevel === l.key ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedLevel === l.key ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: selectedLevel === l.key ? '#a5b4fc' : '#94a3b8',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{l.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.label}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{l.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={startQuiz}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Start Quiz 🚀
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#94a3b8' }}>Available Question Banks</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['🌱 Beginner', '🌿 Intermediate', '⚡ Advanced', '🔥 Expert'].map(l => (
              <div key={l} style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, padding: '10px', textAlign: 'center', fontSize: 12, color: '#94a3b8',
              }}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ maxWidth: 520, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '📚'}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#f1f5f9' }}>Quiz Complete!</h1>
        <div style={{
          fontSize: 48, fontWeight: 900, margin: '20px 0',
          color: pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444',
        }}>{pct}%</div>
        <p style={{ color: '#94a3b8', marginBottom: 8 }}>{score}/{questions.length} correct</p>
        <p style={{ color: '#6366f1', fontSize: 14 }}>+{score * 15} XP earned!</p>

        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={startQuiz}
            style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            Try Again
          </button>
          <Link href="/learning-path" style={{
            display: 'block', padding: '10px 24px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: '#94a3b8', fontSize: 14, textDecoration: 'none',
          }}>
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.correct;

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>Question {current + 1} / {questions.length}</span>
        <span style={{ fontSize: 13, color: '#10b981' }}>Score: {score}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 24 }}>
        <div style={{
          height: '100%', width: `${((current + 1) / questions.length) * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 2, transition: 'width 0.3s',
        }} />
      </div>

      {/* Question */}
      <div style={{
        background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '24px 28px', marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Module {q.moduleId} · {q.level}
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.5 }}>{q.question}</h2>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.04)';
          let border = 'rgba(255,255,255,0.08)';
          let color = '#e2e8f0';
          if (answered) {
            if (i === q.correct) { bg = 'rgba(16,185,129,0.15)'; border = '#10b981'; color = '#6ee7b7'; }
            else if (i === selected && !isCorrect) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; color = '#fca5a5'; }
          } else if (selected === i) {
            bg = 'rgba(99,102,241,0.2)'; border = '#6366f1'; color = '#a5b4fc';
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              style={{
                padding: '14px 18px', borderRadius: 10, cursor: answered ? 'default' : 'pointer',
                background: bg, border: `1px solid ${border}`, color, fontSize: 14,
                textAlign: 'left', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: '50%', border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
                background: answered && i === q.correct ? '#10b981' : 'transparent',
              }}>
                {answered && i === q.correct ? '✓' : answered && i === selected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div style={{
          background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
          borderRadius: 12, padding: '14px 18px', marginBottom: 16,
        }}>
          <div style={{ fontWeight: 600, color: isCorrect ? '#10b981' : '#ef4444', marginBottom: 6, fontSize: 14 }}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>{q.explanation}</p>

          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <button
              onClick={getAiExplain}
              disabled={explainLoading}
              style={{
                padding: '6px 14px', background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6,
                color: '#a5b4fc', fontSize: 12, cursor: 'pointer',
              }}
            >
              {explainLoading ? 'Loading…' : '🤖 AI Deep Explanation'}
            </button>
          </div>

          {aiExplanation && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {aiExplanation}
            </div>
          )}
        </div>
      )}

      {answered && (
        <button
          onClick={next}
          style={{
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <AppShell>
      <div style={{ padding: '32px 40px' }}>
        <Suspense fallback={<div style={{ color: '#94a3b8' }}>Loading quiz…</div>}>
          <QuizContent />
        </Suspense>
      </div>
    </AppShell>
  );
}
