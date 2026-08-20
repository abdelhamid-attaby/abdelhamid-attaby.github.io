/**
 * Client for the Vercel API. The static site knows only this base URL —
 * no keys, no database, nothing privileged ever reaches the browser.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatQuota {
  used: number;
  limit: number;
  resetsAt?: string;
}

export class ChatError extends Error {
  constructor(
    message: string,
    readonly kind: 'quota' | 'resting' | 'offline' | 'unknown',
    readonly quota?: ChatQuota,
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

/**
 * Streams an answer, calling `onToken` for each chunk. Returns the quota the
 * server reported so the UI can show what is left without a second request.
 */
export async function streamChat(
  messages: ChatMessage[],
  opts: { signal?: AbortSignal; onToken: (t: string) => void },
): Promise<ChatQuota | undefined> {
  if (!API_BASE) {
    throw new ChatError('The assistant is not configured yet.', 'offline');
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: opts.signal,
    });
  } catch {
    throw new ChatError('I could not reach the assistant just now.', 'offline');
  }

  const quota = readQuota(res.headers);

  if (res.status === 429) {
    throw new ChatError(
      'You have used your questions for today. The form below reaches me directly.',
      'quota',
      quota,
    );
  }
  if (res.status === 503) {
    throw new ChatError(
      'The assistant is resting — it runs on a free model with a daily budget, and today’s is spent. It resets at midnight UTC.',
      'resting',
      quota,
    );
  }
  if (!res.ok || !res.body) {
    throw new ChatError('Something went wrong answering that.', 'unknown', quota);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // Server-sent events: lines of `data: {...}`, terminated by `data: [DONE]`.
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return quota;
      try {
        const token = JSON.parse(payload)?.t;
        if (typeof token === 'string' && token) opts.onToken(token);
      } catch {
        // A partial frame — the next read completes it.
      }
    }
  }

  return quota;
}

function readQuota(headers: Headers): ChatQuota | undefined {
  const limit = Number(headers.get('X-Quota-Limit'));
  const used = Number(headers.get('X-Quota-Used'));
  if (!Number.isFinite(limit) || !Number.isFinite(used) || !limit) return undefined;
  return { used, limit, resetsAt: headers.get('X-Quota-Reset') ?? undefined };
}

export async function sendContact(body: { name: string; email: string; message: string }) {
  if (!API_BASE) throw new Error('not-configured');
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || 'failed');
  }
  return true;
}
