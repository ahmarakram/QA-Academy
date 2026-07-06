'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';
import { reviewInterviewAnswer } from '@/lib/offline-agent';
import { groqReviewInterviewAnswer } from '@/lib/groq';
import { questions, LEVELS, COUNTRIES, COMPANIES, type InterviewQuestion } from '@/lib/interview-questions';

const FLAG: Record<string, string> = {
  Global: '🌍', India: '🇮🇳', US: '🇺🇸', UK: '🇬🇧', UAE: '🇦🇪', Canada: '🇨🇦', Australia: '🇦🇺',
};

export default function InterviewPrepPage() {
  const { level, groqSettings } = useStore();

  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [search, setSearch] = useState('');

  const [selectedQ, setSelectedQ] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const filtered = questions.filter(q => {
    if (selectedLevel !== 'All' && q.level !== selectedLevel) return false;
    if (selectedCountry !== 'All' && q.country !== selectedCountry && q.country !== 'Global') return false;
    if (selectedCompany !== 'All' && q.company !== selectedCompany) return false;
    if (search && !q.question.toLowerCase().includes(search.toLowerCase()) &&
        !q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const getFeedback = async () => {
    if (!answer.trim() || !selectedQ) return;
    setFeedbackLoading(true);
    if (groqSettings.enabled && groqSettings.apiKey) {
      const text = await groqReviewInterviewAnswer(groqSettings.apiKey, groqSettings.model, selectedQ.question, answer, selectedQ.modelAnswer);
      setFeedback(text);
    } else {
      await new Promise(r => setTimeout(r, 300));
      setFeedback(reviewInterviewAnswer(selectedQ.question, answer, selectedQ.modelAnswer));
    }
    setFeedbackLoading(false);
  };

  const levelColor: Record<string, string> = {
    'Junior QA': '#10b981', 'Mid QA': '#3b82f6', 'Senior QA': '#f59e0b',
    'SDET': '#8b5cf6', 'QA Lead': '#ef4444', 'QA Manager': '#ec4899', 'AI Quality Engineer': '#6366f1',
  };

  return (
    <AppShell>
      <div className="interview-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* ── Left panel ─────────────────────────────────────────── */}
        <div className="interview-left-panel" style={{
          width: 340, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#f1f5f9' }}>💼 Interview Prep</h1>
              <span style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 20,
                background: groqSettings.enabled ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.15)',
                color: groqSettings.enabled ? '#a5b4fc' : '#10b981',
              }}>
                {groqSettings.enabled ? '🤖 Groq AI' : '✦ AI Tutor'}
              </span>
            </div>

            {/* Search */}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions or tags…"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '8px 10px', color: '#e2e8f0', fontSize: 12, outline: 'none',
                marginBottom: 10, boxSizing: 'border-box',
              }}
            />

            {/* Country filter */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Country</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {['All', ...COUNTRIES].map(c => (
                  <button key={c} onClick={() => setSelectedCountry(c)} style={{
                    padding: '3px 8px', borderRadius: 20, fontSize: 10, cursor: 'pointer', border: 'none',
                    background: selectedCountry === c ? '#6366f1' : 'rgba(255,255,255,0.06)',
                    color: selectedCountry === c ? '#fff' : '#64748b',
                  }}>
                    {FLAG[c] ?? ''} {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Level filter */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Level</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {['All', ...LEVELS].map(l => (
                  <button key={l} onClick={() => setSelectedLevel(l)} style={{
                    padding: '3px 8px', borderRadius: 20, fontSize: 10, cursor: 'pointer', border: 'none',
                    background: selectedLevel === l ? '#a855f7' : 'rgba(255,255,255,0.06)',
                    color: selectedLevel === l ? '#fff' : '#64748b',
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Company filter */}
            <div>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Company</div>
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                  padding: '6px 8px', color: '#e2e8f0', fontSize: 11, outline: 'none',
                }}
              >
                {COMPANIES.map(c => <option key={c} value={c} style={{ background: '#1a1a26' }}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Question list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
            <div style={{ fontSize: 11, color: '#475569', padding: '6px 6px', marginBottom: 2 }}>
              {filtered.length} question{filtered.length !== 1 ? 's' : ''}
            </div>
            {filtered.map(q => (
              <button
                key={q.id}
                onClick={() => { setSelectedQ(q); setAnswer(''); setFeedback(''); setShowModel(false); }}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: selectedQ?.id === q.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: `1px solid ${selectedQ?.id === q.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  marginBottom: 3,
                }}
              >
                <div style={{ display: 'flex', gap: 4, marginBottom: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{
                    padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600,
                    background: `${levelColor[q.level] ?? '#6366f1'}22`,
                    color: levelColor[q.level] ?? '#6366f1',
                  }}>{q.level}</span>
                  <span style={{ fontSize: 11 }}>{FLAG[q.country] ?? '🌍'}</span>
                  {q.company && (
                    <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 9, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                      {q.company}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.4 }}>
                  {q.question.substring(0, 75)}{q.question.length > 75 ? '…' : ''}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: 13 }}>
                No questions match your filters
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
          {!selectedQ ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>💼</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>Mock Interview Practice</h2>
              <p style={{ color: '#64748b', fontSize: 14, maxWidth: 400, margin: '0 auto 24px' }}>
                {questions.length}+ questions across {COUNTRIES.length} countries, all levels from Junior to AI Quality Engineer.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500, margin: '0 auto' }}>
                {COUNTRIES.map(c => (
                  <button key={c} onClick={() => setSelectedCountry(c)} style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
                  }}>
                    {FLAG[c]} {c}
                  </button>
                ))}
              </div>
              {!groqSettings.enabled && (
                <div style={{
                  marginTop: 28, padding: '14px 20px', background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, maxWidth: 420, margin: '28px auto 0',
                }}>
                  <div style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600, marginBottom: 4 }}>💡 Unlock GPT-level feedback</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Add a free Groq API key in Settings to get deep, personalised interview feedback powered by Llama 3.3 70B.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: 720 }}>
              {/* Header */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 6, fontSize: 12,
                  background: `${levelColor[selectedQ.level] ?? '#6366f1'}22`,
                  color: levelColor[selectedQ.level] ?? '#6366f1', fontWeight: 600,
                }}>{selectedQ.level}</span>
                <span style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                  {selectedQ.category}
                </span>
                <span style={{ fontSize: 14 }}>{FLAG[selectedQ.country]}</span>
                {selectedQ.company && (
                  <span style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                    {selectedQ.company}
                  </span>
                )}
              </div>

              {/* Question */}
              <div style={{
                background: '#12121a', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '20px 24px', marginBottom: 20,
              }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px', lineHeight: 1.5 }}>
                  🎙️ {selectedQ.question}
                </h2>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Follow-up questions:</div>
                {selectedQ.followUps.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#475569', marginBottom: 3 }}>→ {f}</div>
                ))}
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedQ.tags.map(t => (
                    <span key={t} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#475569' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Answer input */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Write your answer as you would in a real interview…"
                  rows={9}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                    padding: '14px', color: '#e2e8f0', fontSize: 14,
                    outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: 11, color: '#334155', marginTop: 4 }}>
                  {answer.split(/\s+/).filter(Boolean).length} words
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <button
                  onClick={getFeedback}
                  disabled={!answer.trim() || feedbackLoading}
                  style={{
                    padding: '10px 20px',
                    background: groqSettings.enabled
                      ? 'linear-gradient(135deg, #6366f1, #3b82f6)'
                      : 'linear-gradient(135deg, #6366f1, #a855f7)',
                    border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13,
                    fontWeight: 600, opacity: !answer.trim() ? 0.5 : 1,
                  }}
                >
                  {feedbackLoading
                    ? '⏳ Analysing…'
                    : groqSettings.enabled ? '🤖 Get Groq AI Feedback' : '🤖 Get AI Feedback'}
                </button>
                <button
                  onClick={() => setShowModel(!showModel)}
                  style={{
                    padding: '10px 20px', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                    color: '#94a3b8', cursor: 'pointer', fontSize: 13,
                  }}
                >
                  {showModel ? 'Hide Model Answer' : '📖 Model Answer'}
                </button>
                <button
                  onClick={() => {
                    const next = filtered[filtered.indexOf(selectedQ) + 1];
                    if (next) { setSelectedQ(next); setAnswer(''); setFeedback(''); setShowModel(false); }
                  }}
                  disabled={filtered.indexOf(selectedQ) >= filtered.length - 1}
                  style={{
                    padding: '10px 16px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                    color: '#64748b', cursor: 'pointer', fontSize: 13,
                    opacity: filtered.indexOf(selectedQ) >= filtered.length - 1 ? 0.3 : 1,
                  }}
                >
                  Next →
                </button>
              </div>

              {/* Model answer */}
              {showModel && (
                <div style={{
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 12, padding: '16px 20px', marginBottom: 16,
                }}>
                  <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>📖 Model Answer</div>
                  <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {selectedQ.modelAnswer}
                  </p>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div style={{
                  background: groqSettings.enabled ? 'rgba(59,130,246,0.08)' : 'rgba(99,102,241,0.08)',
                  border: `1px solid ${groqSettings.enabled ? 'rgba(59,130,246,0.25)' : 'rgba(99,102,241,0.2)'}`,
                  borderRadius: 12, padding: '18px 22px',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: groqSettings.enabled ? '#93c5fd' : '#6366f1' }}>
                    {groqSettings.enabled ? '🤖 Groq AI Feedback (Llama 3.3 70B)' : '🤖 AI Feedback'}
                  </div>
                  <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedback}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
