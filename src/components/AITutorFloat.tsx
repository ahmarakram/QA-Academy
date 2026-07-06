'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { askOfflineAgent } from '@/lib/offline-agent';

interface Msg { role: 'user' | 'assistant'; content: string; }

export default function AITutorFloat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const { level } = useStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    setMsgs(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    // Small delay for UX feel
    await new Promise(r => setTimeout(r, 300));
    const result = askOfflineAgent(userMsg.content, level);
    setMsgs(m => [...m, { role: 'assistant', content: result.text }]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          border: 'none', cursor: 'pointer', fontSize: 22,
          boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="AI Tutor"
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, zIndex: 999,
          width: 380, maxHeight: 520,
          background: '#12121a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>QA Tutor</div>
              <div style={{ fontSize: 11, color: '#10b981' }}>✦ AI Tutor — ask me anything</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.length === 0 && (
              <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20 }}>
                Ask me anything about QA, testing, automation, or AI quality engineering!
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: 12,
                  background: m.role === 'user' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: '#e2e8f0', fontSize: 13, lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: '#6366f1', fontSize: 13, paddingLeft: 4 }}>Thinking…</div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about any QA topic…"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 14px', background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
