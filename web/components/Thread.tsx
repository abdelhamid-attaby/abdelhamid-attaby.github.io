'use client';

import type { ChatError } from '@/lib/api';
import type { ChatMessage } from '@/lib/api';
import { SUGGESTIONS } from './useChat';

interface Props {
  messages: ChatMessage[];
  streaming: boolean;
  error: ChatError | null;
  onAsk: (q: string) => void;
  emptyState?: React.ReactNode;
}

/** Renders **bold** as <strong>; nothing else. Answers are plain prose. */
function formatted(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function Thread({ messages, streaming, error, onAsk, emptyState }: Props) {
  const empty = messages.length === 0;

  return (
    <div className="thread" aria-live="polite" aria-atomic="false">
      {empty && (
        <>
          {emptyState}
          <div className="suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => onAsk(s)} type="button">
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {messages.map((m, i) => {
        const last = i === messages.length - 1;
        return (
          <div className={m.role === 'user' ? 'turn q' : 'turn'} key={i}>
            <div className="turn-who">{m.role === 'user' ? 'you' : 'cv'}</div>
            <div
              className={
                streaming && last && m.role === 'assistant' ? 'turn-body caret' : 'turn-body'
              }
            >
              {m.content ? formatted(m.content) : streaming && last ? '' : null}
            </div>
          </div>
        );
      })}

      {error && <p className="notice">{error.message}</p>}
    </div>
  );
}
