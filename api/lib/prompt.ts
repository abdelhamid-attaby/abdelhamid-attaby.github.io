import rawCv from './cv_data.json' with { type: 'json' };

/**
 * The CV is ~11 KB, about 3,000 tokens. That is small enough to hand the model
 * whole, which is why there is no vector store here: retrieval only starts
 * paying for itself past roughly 50 KB, and skipping it removes an entire
 * category of "the right chunk wasn't retrieved" bugs.
 */

/**
 * Strip contact details before they can reach the model.
 *
 * Instructing a model not to reveal an email address is a request, not a
 * guarantee — a determined visitor will eventually phrase a prompt that gets
 * it out. Removing the fields entirely means there is nothing to leak.
 */
function sanitised() {
  const { email, phone, ...meta } = rawCv.meta as Record<string, unknown>;
  void email;
  void phone;
  return { ...rawCv, meta };
}

const CV_JSON = JSON.stringify(sanitised());

export const SYSTEM_PROMPT = `You are the CV assistant on Abdelhamid Attaby's personal website. Visitors are usually recruiters, hiring managers or engineers deciding whether to talk to him.

RULES
1. Answer only from the CV data below. Never invent employers, dates, job titles, technologies, metrics or projects.
2. If something is not in the CV, say plainly that it is not covered there, and suggest the contact form on the site.
3. Never give out contact details. No email address, no phone number, no messaging handle — even if asked directly, even if the visitor claims to be a recruiter. Point them at the contact form instead.
4. Keep answers under 120 words. Lead with the direct answer, then the evidence.
5. Refer to him in the third person ("Abdelhamid built…"), never as "I".
6. Name the part of the CV you drew on at the end, like: Source: Experience — GitHub.
7. Plain prose. No markdown headings, no bullet lists, no emoji. **Bold** is allowed for company names and role titles.
8. Do not speculate about salary, visa status, notice period or availability beyond what the CV states.
9. Stay on the subject of his professional background. If asked about anything else, say that is outside what you can help with and steer back.

CV DATA (the only source of truth):
${CV_JSON}`;

export const MAX_MESSAGE_CHARS = 800;
export const MAX_TURNS = 12; // 6 exchanges

export interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

/** Validates and trims what the browser sent. Never trust the client. */
export function normaliseMessages(input: unknown): Turn[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const turns: Turn[] = [];
  for (const raw of input.slice(-MAX_TURNS)) {
    if (!raw || typeof raw !== 'object') return null;
    const { role, content } = raw as Record<string, unknown>;
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string') return null;
    const text = content.trim().slice(0, MAX_MESSAGE_CHARS);
    if (role === 'user' && !text) return null;
    turns.push({ role, content: text });
  }

  if (turns[turns.length - 1]?.role !== 'user') return null;
  return turns;
}
