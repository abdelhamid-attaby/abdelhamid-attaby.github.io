import { createHash } from 'node:crypto';
import { db } from './mongo.js';

/**
 * Two limits, both enforced here rather than at OpenRouter.
 *
 *  · per visitor — so one person cannot drain the day's budget
 *  · site-wide   — because OpenRouter's free tier allows roughly 200 requests
 *                  per day across the whole account. That ceiling, not cost,
 *                  is the real constraint, and hitting it would return errors
 *                  to every visitor rather than a graceful message.
 *
 * Both counters use a single atomic findOneAndUpdate, so two concurrent
 * requests can never both read "one left" and both proceed.
 */

const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY || 8);
const PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR || 4);
const GLOBAL_CAP = Number(process.env.DAILY_GLOBAL_CAP || 180);

export interface Verdict {
  ok: boolean;
  reason?: 'per-ip' | 'global';
  used: number;
  limit: number;
  resetsAt: string;
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || '';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function hourKey(): string {
  return new Date().toISOString().slice(0, 13);
}

function midnightUtc(): Date {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d;
}

export async function consume(ipHash: string): Promise<Verdict> {
  const database = await db();
  const day = today();
  const resetsAt = midnightUtc().toISOString();

  // --- per visitor -------------------------------------------------------
  const perIp = await database.collection('rate_limits').findOneAndUpdate(
    { _id: `${ipHash}:${day}` as never },
    {
      $inc: { count: 1, [`hours.${hourKey().slice(11)}`]: 1 },
      $setOnInsert: { expiresAt: midnightUtc() },
    },
    { upsert: true, returnDocument: 'after' },
  );

  const used: number = perIp?.count ?? 1;
  const thisHour: number = perIp?.hours?.[hourKey().slice(11)] ?? 1;

  if (used > PER_DAY || thisHour > PER_HOUR) {
    return { ok: false, reason: 'per-ip', used: Math.min(used, PER_DAY), limit: PER_DAY, resetsAt };
  }

  // --- site-wide ---------------------------------------------------------
  const global = await database.collection('daily_usage').findOneAndUpdate(
    { _id: day as never },
    { $inc: { requests: 1 } },
    { upsert: true, returnDocument: 'after' },
  );

  if ((global?.requests ?? 1) > GLOBAL_CAP) {
    return { ok: false, reason: 'global', used, limit: PER_DAY, resetsAt };
  }

  return { ok: true, used, limit: PER_DAY, resetsAt };
}

/** Give a request back when the upstream call failed before producing tokens. */
export async function refund(ipHash: string): Promise<void> {
  try {
    const database = await db();
    const day = today();
    await Promise.all([
      database.collection('rate_limits').updateOne(
        { _id: `${ipHash}:${day}` as never },
        { $inc: { count: -1, [`hours.${hourKey().slice(11)}`]: -1 } },
      ),
      database.collection('daily_usage').updateOne({ _id: day as never }, { $inc: { requests: -1 } }),
    ]);
  } catch {
    // A failed refund is not worth failing the response over.
  }
}
