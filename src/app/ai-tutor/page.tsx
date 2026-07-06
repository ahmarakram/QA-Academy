'use client';

import { useState, useRef, useEffect } from 'react';
import { findBestMatch, suggestedQuestions, type KBEntry } from '@/lib/chatbot-kb';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';

interface Message {
  id: string;
  role: 'user' | 'aria';
  text: string;
  topic?: string;
  followUps?: string[];
  timestamp: Date;
}

function formatMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '14px 18px' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'inline-block',
          animation: `bounce ${1.2}s ${i * 0.2}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'aria',
  text: `Hi! I'm **Khirad**, your QA Academy learning assistant. 👋\n\nI have complete knowledge of everything on this platform — learning paths, certifications, capstone projects, career intelligence, automation tools, CI/CD, and every QA concept you need to know.\n\nAsk me anything. I'm here to help you grow as a QA engineer.`,
  followUps: ['How do I get started?', 'What certifications are available?', 'Tell me about capstone projects', 'Which career path is right for me?'],
  timestamp: new Date(),
};

const topicColor: Record<string, string> = {
  'General': '#6366f1',
  'Platform': '#8b5cf6',
  'Learning Path': '#10b981',
  'Quiz Center': '#f59e0b',
  'AI Tutor': '#a855f7',
  'Certifications': '#f59e0b',
  'Capstone Projects': '#ef4444',
  'Interview Prep': '#3b82f6',
  'Career': '#ec4899',
  'CI/CD': '#14b8a6',
  'Automation Tools': '#f97316',
  'AI Tools': '#a855f7',
  'Glossary': '#6b7280',
  'Pricing': '#10b981',
  'QA Fundamentals': '#3b82f6',
  'Help': '#6366f1',
};

export default function AITutorPage() {
  const { tutorHistory, addXP } = useStore();

  // Always start with WELCOME so server and client initial render match.
  // After mount, switch to stored history (client-only, no hydration issue).
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (tutorHistory.length > 0) {
      setMessages(tutorHistory.map((h) => ({
        role: h.role,
        text: h.content,
        timestamp: new Date(),
      })) as Message[]);
      setShowSuggestions(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const store = useStore.getState();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setShowSuggestions(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = Math.min(600 + text.length * 12, 1400);
    setTimeout(() => {
      const match: KBEntry = findBestMatch(text);
      const ariaMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aria',
        text: match.answer,
        topic: match.topic,
        followUps: match.followUps,
        timestamp: new Date(),
      };
      setTyping(false);
      setMessages(prev => {
        const updated = [...prev, ariaMsg];
        // Persist to store (skip welcome-only state)
        useStore.getState().setTutorHistory(
          updated.filter(m => m.id !== 'welcome').map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.text,
          }))
        );
        return updated;
      });
    }, delay);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <AppShell>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      background: 'var(--bg)',
      fontFamily: 'inherit',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(99,102,241,0.12)',
        background: 'rgba(15,15,25,0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 16,
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
          boxShadow: '0 0 20px rgba(99,102,241,0.35)',
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 800, fontSize: 17, color: '#f1f5f9',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            Khirad
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px',
              borderRadius: 20,
              background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc',
              letterSpacing: '0.06em',
            }}>QA ACADEMY ASSISTANT</span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#10b981',
              display: 'inline-block', boxShadow: '0 0 6px rgba(16,185,129,0.8)',
            }} />
            Active · Knows the full QA Academy curriculum
          </div>
        </div>
        <button
          onClick={() => { setMessages([WELCOME]); setShowSuggestions(true); }}
          title="New conversation"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
            color: '#64748b', fontSize: 12, fontWeight: 600,
            transition: 'all 0.15s',
          }}
        >
          + New chat
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            padding: '6px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.role === 'aria' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, maxWidth: 780, width: '100%' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 12,
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0, marginTop: 2,
                  boxShadow: '0 0 12px rgba(99,102,241,0.25)',
                }}>🤖</div>
                <div style={{ flex: 1 }}>
                  {msg.topic && msg.id !== 'welcome' && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: topicColor[msg.topic] ?? '#6366f1',
                      letterSpacing: '0.08em',
                      display: 'block', marginBottom: 6,
                    }}>{msg.topic.toUpperCase()}</span>
                  )}
                  <div style={{
                    background: 'rgba(30,30,50,0.8)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '4px 18px 18px 18px',
                    padding: '14px 18px',
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    color: '#cbd5e1',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                  }}>
                    {formatMessage(msg.text)}
                  </div>
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {msg.followUps.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          style={{
                            padding: '5px 12px', borderRadius: 20,
                            background: 'rgba(99,102,241,0.08)',
                            border: '1px solid rgba(99,102,241,0.22)',
                            color: '#a5b4fc', fontSize: 12, cursor: 'pointer',
                            fontWeight: 500, transition: 'all 0.15s',
                          }}
                        >{q}</button>
                      ))}
                    </div>
                  )}
                  {mounted && (
                    <div style={{ marginTop: 4, fontSize: 10, color: '#334155' }}>
                      {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {msg.role === 'user' && (
              <div style={{ maxWidth: 560 }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.2))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '18px 4px 18px 18px',
                  padding: '12px 16px',
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                }}>{msg.text}</div>
                <div style={{ marginTop: 4, fontSize: 10, color: '#334155', textAlign: 'right' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div style={{ padding: '6px 24px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
              boxShadow: '0 0 12px rgba(99,102,241,0.25)',
            }}>🤖</div>
            <div style={{
              background: 'rgba(30,30,50,0.8)',
              border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: '4px 18px 18px 18px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}>
              <TypingDots />
            </div>
          </div>
        )}

        {showSuggestions && messages.length === 1 && (
          <div style={{ padding: '20px 24px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#334155',
              letterSpacing: '0.08em', marginBottom: 12, textTransform: 'uppercase',
            }}>Try asking Khirad</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '11px 14px',
                    background: 'rgba(30,30,50,0.6)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: 12,
                    color: '#94a3b8',
                    fontSize: 13,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    lineHeight: 1.4,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💬</span>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px 20px',
        borderTop: '1px solid rgba(99,102,241,0.1)',
        background: 'rgba(10,10,18,0.95)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          maxWidth: 860,
          margin: '0 auto',
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(30,30,50,0.8)',
            border: '1px solid rgba(99,102,241,0.22)',
            borderRadius: 16,
            padding: '4px 4px 4px 18px',
            gap: 8,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Khirad anything about QA Academy…"
              disabled={typing}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e2e8f0',
                fontSize: 14.5,
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: input.trim() && !typing
                  ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                  : 'rgba(255,255,255,0.05)',
                border: 'none',
                cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, transition: 'all 0.2s',
                boxShadow: input.trim() && !typing ? '0 0 16px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              {typing ? '⏳' : '➤'}
            </button>
          </div>
        </div>
        <div style={{
          textAlign: 'center', fontSize: 11, color: '#1e293b', marginTop: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          Khirad has full knowledge of QA Academy · Press Enter to send
        </div>
      </div>
    </div>
    </AppShell>
  );
}
