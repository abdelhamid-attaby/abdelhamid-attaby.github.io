/**
 * Post-build guard.
 *
 * Scans everything that will be published for contact details and secrets. The
 * privacy claim on the contact section is only true if it is enforced, and a
 * refactor that innocently imports `cv_data.json` into a client component
 * would otherwise put an email address back into the bundle without a warning.
 *
 * Fails the build — and therefore the deploy — rather than reporting.
 */
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'out');

const FORBIDDEN = [
  { label: 'email address', re: /[\w.+-]+@(?!resend\.dev)[\w-]+\.[\w.]{2,}/ },
  // Deliberately narrow. A bare run of digits matches Number.MAX_SAFE_INTEGER
  // inside Next's own polyfills, so require either an international prefix or
  // human-style separators — the shapes a real number actually takes.
  { label: 'phone number', re: /\+\d{7,15}\b|\b\d{2,4}[\s.-]\d{3,4}[\s.-]\d{3,4}\b/ },
  { label: 'OpenRouter key', re: /sk-or-v1-[a-f0-9]{16,}/i },
  { label: 'MongoDB URI', re: /mongodb(\+srv)?:\/\// },
];

// Fonts and images are binary; scanning them produces noise, not findings.
const TEXTUAL = /\.(html?|js|mjs|css|json|txt|xml|svg|map)$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (TEXTUAL.test(entry.name)) yield path;
  }
}

const findings = [];

for await (const file of walk(OUT)) {
  const text = await readFile(file, 'utf8');
  for (const { label, re } of FORBIDDEN) {
    const hit = text.match(re);
    if (hit) findings.push(`${label} "${hit[0]}" in ${file.replace(OUT, 'out')}`);
  }
}

if (findings.length) {
  console.error('\ncheck-export FAILED — the following must not be published:\n');
  for (const f of findings) console.error(`  · ${f}`);
  console.error(
    '\nMost likely cause: a client component importing content/cv_data.json' +
      ' instead of content/cv.ts. Fix the import; do not weaken this check.\n',
  );
  process.exit(1);
}

console.log('check-export: clean — no contact details or secrets in out/');
