/**
 * OpenRouter, free models only.
 *
 * The roster of `:free` models changes often — models get retired, added and
 * renamed without notice. Hard-coding one would mean the site silently breaks
 * the day it disappears, so the chain is resolved against the live model list
 * and cached for an hour. `openrouter/free` is the last resort: it is
 * OpenRouter's own router across whatever is free at that moment.
 */

const PREFERRED = (
  process.env.OPENROUTER_MODELS ||
  'z-ai/glm-5.2:free,openai/gpt-oss-20b:free,google/gemma-4-31b-it:free,openrouter/free'
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const CATALOGUE_TTL_MS = 60 * 60 * 1000;

let cache: { at: number; models: string[] } | null = null;

async function freeModels(): Promise<string[]> {
  if (cache && Date.now() - cache.at < CATALOGUE_TTL_MS) return cache.models;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(String(res.status));

    const body = (await res.json()) as {
      data?: { id: string; pricing?: { prompt?: string; completion?: string } }[];
    };

    const free = (body.data ?? [])
      .filter((m) => Number(m.pricing?.prompt ?? 1) === 0 && Number(m.pricing?.completion ?? 1) === 0)
      .map((m) => m.id);

    // Preferred order first, then anything else free as a backstop.
    const ordered = [
      ...PREFERRED.filter((m) => free.includes(m)),
      ...free.filter((m) => !PREFERRED.includes(m)),
    ];

    cache = { at: Date.now(), models: ordered.length ? ordered : PREFERRED };
  } catch {
    // If the catalogue is unreachable, trust the configured list.
    cache = { at: Date.now(), models: PREFERRED };
  }

  return cache.models;
}

export interface StreamHandle {
  model: string;
  body: ReadableStream<Uint8Array>;
}

/**
 * Tries each candidate in turn and returns the first that starts streaming.
 * Only the first few are attempted — if three free models in a row refuse, the
 * problem is upstream and retrying twenty more just makes the visitor wait.
 */
export async function openStream(
  messages: { role: string; content: string }[],
  signal: AbortSignal,
): Promise<StreamHandle> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY is not set');

  const candidates = (await freeModels()).slice(0, 4);
  let lastStatus = 0;

  for (const model of candidates) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal,
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        // OpenRouter uses these for attribution on its dashboard.
        'HTTP-Referer': process.env.ALLOWED_ORIGIN?.split(',')[0] ?? '',
        'X-Title': 'Abdelhamid Attaby — CV assistant',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        max_tokens: Number(process.env.MAX_TOKENS || 400),
        temperature: 0.3, // factual recall, not creativity
      }),
    });

    if (res.ok && res.body) return { model, body: res.body };

    lastStatus = res.status;
    // 429 = this model is rate-limited right now; 404 = retired. Both are
    // worth trying the next candidate for. A 401 means the key is wrong and
    // no other model will help.
    if (res.status === 401 || res.status === 403) break;
  }

  throw new Error(`no-free-model-available (last status ${lastStatus})`);
}

/**
 * Turns OpenRouter's SSE frames into plain text deltas.
 * Yields only content — the client does not need the envelope.
 */
export async function* deltas(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

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
      if (payload === '[DONE]') return;
      try {
        const token = JSON.parse(payload)?.choices?.[0]?.delta?.content;
        if (typeof token === 'string' && token) yield token;
      } catch {
        // Partial frame; the next chunk completes it.
      }
    }
  }
}
