import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Only the GitHub Pages origin may call this API.
 *
 * This is not a security boundary on its own — a non-browser client can send
 * any Origin header it likes, and the rate limiter is what actually protects
 * the quota. What this does stop is somebody embedding the assistant on their
 * own site and quietly spending the daily budget.
 */
const ALLOWED = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = (req.headers.origin || '').replace(/\/$/, '');
  const permitted = ALLOWED.length === 0 || ALLOWED.includes(origin);

  if (permitted && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(permitted ? 204 : 403).end();
    return false;
  }

  if (!permitted) {
    res.status(403).json({ error: 'origin-not-allowed' });
    return false;
  }

  return true;
}

/**
 * Best-effort client IP. Vercel sets x-forwarded-for; the left-most entry is
 * the original client. Never logged raw — always hashed first.
 */
export function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}
