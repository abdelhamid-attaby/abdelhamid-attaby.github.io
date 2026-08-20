'use client';

import { useCallback, useRef, useState } from 'react';
import { ChatError, streamChat, type ChatMessage, type ChatQuota } from '@/lib/api';

export const SUGGESTIONS = [
  'What did he build at GitHub?',
  'Has he led engineering teams?',
  'Is he a fit for a staff AI-engineering role?',
  'What is the largest system he has worked on?',
  'Tell me about his research.',
];

/** Keeps the prompt bounded — the server enforces the same limit. */
const MAX_TURNS = 6;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [quota, setQuota] = useState<ChatQuota | null>(null);
  const abort = useRef<AbortController | null>(null);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || streaming) return;

      setError(null);
      const history = [...messages, { role: 'user' as const, content: text }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setStreaming(true);

      abort.current?.abort();
      abort.current = new AbortController();

      try {
        const reported = await streamChat(history.slice(-MAX_TURNS * 2), {
          signal: abort.current.signal,
          onToken: (token) =>
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === 'assistant') {
                next[next.length - 1] = { ...last, content: last.content + token };
              }
              return next;
            }),
        });
        if (reported) setQuota(reported);
      } catch (err) {
        // Drop the empty assistant turn so the thread does not show a blank answer.
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === 'assistant' && !last.content) next.pop();
          return next;
        });
        const e = err instanceof ChatError ? err : new ChatError('Something went wrong.', 'unknown');
        setError(e);
        if (e.quota) setQuota(e.quota);
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming],
  );

  const reset = useCallback(() => {
    abort.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, ask, reset, streaming, error, quota };
}
