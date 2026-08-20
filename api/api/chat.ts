import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, clientIp } from '../lib/cors.js';
import { consume, hashIp, refund } from '../lib/rateLimit.js';
import { deltas, openStream } from '../lib/openrouter.js';
import { normaliseMessages, SYSTEM_PROMPT } from '../lib/prompt.js';
import { db } from '../lib/mongo.js';

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });

  const messages = normaliseMessages(req.body?.messages);
  if (!messages) return res.status(400).json({ error: 'bad-request' });

  const ipHash = hashIp(clientIp(req));

  // --- quota -------------------------------------------------------------
  let verdict;
  try {
    verdict = await consume(ipHash);
  } catch {
    // If the database is unreachable we cannot account for usage, and an
    // unmetered proxy in front of a shared daily quota is worse than being
    // briefly unavailable. Fail closed.
    return res.status(503).json({ error: 'unavailable' });
  }

  res.setHeader('X-Quota-Limit', String(verdict.limit));
  res.setHeader('X-Quota-Used', String(verdict.used));
  res.setHeader('X-Quota-Reset', verdict.resetsAt);

  if (!verdict.ok) {
    return res.status(verdict.reason === 'global' ? 503 : 429).json({ error: verdict.reason });
  }

  // --- upstream ----------------------------------------------------------
  const controller = new AbortController();
  req.on('close', () => controller.abort());

  let stream;
  try {
    stream = await openStream(
      [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      controller.signal,
    );
  } catch {
    await refund(ipHash); // no answer produced, so it should not cost a request
    return res.status(502).json({ error: 'upstream-unavailable' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let answer = '';
  try {
    for await (const token of deltas(stream.body)) {
      answer += token;
      res.write(`data: ${JSON.stringify({ t: token })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
  } catch {
    // The visitor navigated away, or the upstream dropped mid-answer. Either
    // way the headers are already sent, so just close cleanly.
  } finally {
    res.end();
  }

  // Logged after the response so it never delays a single token.
  void log(ipHash, messages, answer, stream.model);
}

async function log(
  ipHash: string,
  messages: { role: string; content: string }[],
  answer: string,
  model: string,
) {
  if (!answer) return;
  try {
    const database = await db();
    await database.collection('conversations').insertOne({
      ipHash,
      question: messages[messages.length - 1]?.content ?? '',
      answer,
      turns: messages.length,
      model,
      createdAt: new Date(),
    });
  } catch {
    // Analytics are not worth an error path.
  }
}
