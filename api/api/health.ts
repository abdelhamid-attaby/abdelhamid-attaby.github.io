import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../lib/mongo';

/** Cheap liveness check — confirms config and database reachability. */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const checks = {
    openrouterKey: Boolean(process.env.OPENROUTER_API_KEY),
    allowedOrigin: Boolean(process.env.ALLOWED_ORIGIN),
    ipSalt: Boolean(process.env.IP_HASH_SALT),
    mongo: false,
  };

  try {
    const database = await db();
    await database.command({ ping: 1 });
    checks.mongo = true;
  } catch {
    checks.mongo = false;
  }

  const ok = Object.values(checks).every(Boolean);
  res.status(ok ? 200 : 503).json({ ok, checks });
}
