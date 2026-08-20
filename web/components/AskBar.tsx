'use client';

import { useEffect, useRef, useState } from 'react';
import Thread from './Thread';
import { useChat } from './useChat';

/**
 * A slim bar pinned to the bottom of every page. Quiet by default; asking a
 * question opens a panel above it. The CV sells itself — this is the proof,
 * not the pitch.
 */
export default function AskBar() {
  const { messages, ask, streaming, error, quota } = useChat();
  const [draft, setDraft] = useState('');
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  const active = open && (messages.length > 0 || !!error);

  useEffect(() => {
    if (panel.current) panel.current.scrollTop = panel.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setOpen(true);
    ask(draft);
    setDraft('');
  }

  function askSuggested(q: string) {
    setOpen(true);
    ask(q);
  }

  return (
    <>
      {active && (
        <div className="panel" ref={panel} role="region" aria-label="CV assistant">
          <div className="shell">
            <div className="panel-in">
              <Thread
                messages={messages}
                streaming={streaming}
                error={error}
                onAsk={askSuggested}
              />
            </div>
          </div>
        </div>
      )}

      <div className="askbar">
        <div className="shell">
          <div className="askbar-in">
            <span className="askbar-label">
              Ask my <b>CV</b>
            </span>

            <form onSubmit={submit}>
              <label htmlFor="askbar-input" className="skip">
                Ask a question about Abdelhamid&rsquo;s experience
              </label>
              <input
                id="askbar-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask anything about my experience…"
                maxLength={800}
                autoComplete="off"
                disabled={streaming}
              />
              <button className="askbar-send" type="submit" disabled={streaming || !draft.trim()}>
                {streaming ? 'Thinking' : 'Ask'}
              </button>
            </form>

            {active ? (
              <button className="askbar-toggle" onClick={() => setOpen(false)}>
                Close
              </button>
            ) : quota ? (
              <span className="askbar-toggle">
                {Math.max(0, quota.limit - quota.used)} left today
              </span>
            ) : (
              <a className="askbar-toggle" href="/chat/">
                Open full page
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
