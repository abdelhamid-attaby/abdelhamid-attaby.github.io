'use client';

import { useState } from 'react';
import { LINKS } from '@/content/cv';
import { sendContact } from '@/lib/api';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [state, setState] = useState<State>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  // Honeypot: a real person never fills a field they cannot see.
  const [company, setCompany] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending') return;
    if (company) { setState('sent'); return; } // silently swallow bots
    setState('sending');
    try {
      await sendContact(form);
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="h2">Let&rsquo;s talk.</h2>
        <p>
          Remote, any timezone. Open to staff and senior engineering, AI
          engineering, and technical leadership.
        </p>
      </div>

      <div className="contact-grid">
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="c-name">Your name</label>
            <input
              id="c-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {/* honeypot — hidden from people, irresistible to bots */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <label htmlFor="c-company">Company</label>
            <input
              id="c-company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <button className="submit" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Sent — thank you' : 'Send message'}
          </button>

          {state === 'error' && (
            <p className="notice" style={{ marginTop: 18 }}>
              That did not go through. Try again, or reach me on LinkedIn.
            </p>
          )}

          <p className="form-note">
            I do not publish my email address or phone number — this form reaches
            me directly, and nothing here is visible to scrapers.
          </p>
        </form>

        <div className="facts">
          <div className="fact">
            <span className="fact-k">Based</span>
            <span className="fact-v">New Cairo, Egypt</span>
          </div>
          <div className="fact">
            <span className="fact-k">Work</span>
            <span className="fact-v">Remote — any timezone</span>
          </div>
          <div className="fact">
            <span className="fact-k">Open to</span>
            <span className="fact-v">
              Staff &amp; senior engineering · AI engineering · Technical leadership
            </span>
          </div>
          <div className="fact">
            <span className="fact-k">Elsewhere</span>
            <span className="fact-v">
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
              {' · '}
              <a href={LINKS.github} target="_blank" rel="noreferrer noopener">GitHub</a>
              {' · '}
              <a href={LINKS.scholar} target="_blank" rel="noreferrer noopener">Scholar</a>
              {' · '}
              <a href={LINKS.toptal} target="_blank" rel="noreferrer noopener">Toptal</a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
