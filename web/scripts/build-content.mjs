/**
 * Generates content/cv.public.json — the CV with contact details removed.
 *
 * Why this is a build step and not a function call:
 *
 * `cv_data.json` is shared with the CV/PDF pipeline, so it contains an email
 * address and a phone number. Importing it and destructuring those fields away
 * at runtime does NOT keep them out of the bundle — the bundler inlines the
 * whole JSON module, and the stripped fields sit there in plain text inside
 * app/page-*.js for anyone who opens devtools. That is exactly what happened
 * the first time this was written.
 *
 * Emitting a separate, already-clean file is the only version that holds: the
 * raw JSON is never referenced by anything the browser downloads.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, '..', 'content', 'cv_data.json');
const TARGET = join(here, '..', 'content', 'cv.public.json');

/** Anything named here is removed from meta before the file is written. */
const PRIVATE_FIELDS = ['email', 'phone'];

const cv = JSON.parse(await readFile(SOURCE, 'utf8'));

if (!cv?.meta) {
  throw new Error('cv_data.json has no `meta` object — refusing to emit content.');
}

const removed = [];
for (const field of PRIVATE_FIELDS) {
  if (field in cv.meta) {
    delete cv.meta[field];
    removed.push(field);
  }
}

// Belt and braces: catch a contact detail that moved somewhere else in the
// file rather than sitting under `meta`.
const serialised = JSON.stringify(cv, null, 2);
const suspicious = [/[\w.+-]+@[\w-]+\.[\w.]+/, /\+?\d[\d\s()-]{9,}\d/];
for (const pattern of suspicious) {
  const hit = serialised.match(pattern);
  if (hit) {
    throw new Error(
      `build-content: found what looks like a contact detail (${hit[0]}) outside meta.` +
        ' Remove it or add its field to PRIVATE_FIELDS — it must not reach the browser.',
    );
  }
}

await writeFile(TARGET, `${serialised}\n`, 'utf8');
console.log(`build-content: wrote cv.public.json (stripped: ${removed.join(', ') || 'nothing'})`);
