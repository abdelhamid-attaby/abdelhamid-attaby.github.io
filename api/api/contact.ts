import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, clientIp } from '../lib/cors';
import { hashIp } from '../lib/rateLimit';
import { db } from '../lib/mongo';

const MAX = { name: 120, email: 200, message: 4000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });

  const name = String(req.body?.name ?? '').trim().slice(0, MAX.name);
  const email = String(req.body?.email ?? '').trim().slice(0, MAX.email);
  const message = String(req.body?.message ?? '').trim().slice(0, MAX.message);

  if (!name || !EMAIL.test(email) || message.length < 10) {
    return res.status(400).json({ error: 'invalid' });
  }

  const ipHash = hashIp(clientIp(req));

  // Five messages per address per day is generous for a real enquiry and
  // tedious for anything automated.
  try {
    const database = await db();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await database.collection('contacts').countDocuments({ ipHash, createdAt: { $gte: since } });
    if (recent >= 5) return res.status(429).json({ error: 'too-many' });

    await database.collection('contacts').insertOne({
      name,
      email,
      message,
      ipHash,
      userAgent: String(req.headers['user-agent'] ?? '').slice(0, 300),
      createdAt: new Date(),
      status: 'new',
    });
  } catch {
    return res.status(503).json({ error: 'unavailable' });
  }

  // The message is already stored, so a failed email is a delivery delay, not
  // lost data — respond 200 either way and let the record be the backstop.
  void notify({ name, email, message });

  return res.status(200).json({ ok: true });
}

async function notify(payload: { name: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'site@resend.dev';
  if (!key || !to) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Website <${from}>`,
        to: [to],
        reply_to: payload.email,
        subject: `Website enquiry — ${payload.name}`,
        text: `${payload.name} <${payload.email}>\n\n${payload.message}`,
      }),
    });
  } catch {
    // Stored in Mongo regardless.
  }
}
