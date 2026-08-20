'use client';

import { useEffect, useRef, useState } from 'react';
import Thread from './Thread';
import { useChat } from './useChat';

export default function ChatPage() {
  const { messages, ask, reset, streaming, error, quota } = useChat();
  const [draft, setDraft] = useState('');
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    ask(draft);
    setDraft('');
  }

  return (
    <div className="chatpage">
      <div className="shell">
        <div className="grid">
          <div className="chatpage-head">
            <span className="eyebrow">Ask my CV</span>
          </div>

          <div className="chatpage-body">
            <h1 className="h2" style={{ marginBottom: 16 }}>
              Ask me anything about fifteen years of engineering.
            </h1>
            <p style={{ color: 'var(--ink-2)', maxWidth: '56ch', marginTop: 0 }}>
              This assistant answers only from my CV. If something is not in
              there, it will tell you so rather than invent it — and it will not
              hand out my contact details, so use the form on the main page.
            </p>

            <hr className="rule" style={{ margin: '34px 0 30px' }} />

            <Thread
              messages={messages}
              streaming={streaming}
              error={error}
              onAsk={ask}
              emptyState={
                <p style={{ color: 'var(--ink-3)', fontSize: 14, margin: '0 0 18px' }}>
                  Try one of these, or write your own:
                </p>
              }
            />

            <div ref={end} />

            <hr className="rule" style={{ margin: '34px 0 22px' }} />

            <form onSubmit={submit} className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="chat-input">Your question</label>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
                <input
                  id="chat-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Does he have production experience with LLM agents?"
                  maxLength={800}
                  autoComplete="off"
                  disabled={streaming}
                />
                <button className="submit" type="submit" disabled={streaming || !draft.trim()}>
                  {streaming ? 'Thinking…' : 'Ask'}
                </button>
              </div>
            </form>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                fontSize: 12.5,
                color: 'var(--ink-3)',
                flexWrap: 'wrap',
              }}
            >
              <span>
                {quota
                  ? `${Math.max(0, quota.limit - quota.used)} of ${quota.limit} questions left today`
                  : 'Runs on a free model with a daily budget'}
              </span>
              {messages.length > 0 && (
                <button onClick={reset} style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
                  Clear conversation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
