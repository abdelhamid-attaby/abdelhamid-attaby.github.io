'use client';

import { useState } from 'react';
import { cv, VISIBLE_ROLES } from '@/content/cv';

function splitPeriod(period: string) {
  const [from, to] = period.split('–').map((p) => p.trim());
  return { from, to: to ?? '' };
}

export default function Experience() {
  const [expanded, setExpanded] = useState(false);
  const roles = expanded ? cv.experience : cv.experience.slice(0, VISIBLE_ROLES);
  const hidden = cv.experience.length - VISIBLE_ROLES;

  return (
    <>
      <div className="section-head">
        <h2 className="h2">Fifteen years, shipped.</h2>
      </div>

      <div>
        {roles.map((job, i) => {
          const { to } = splitPeriod(job.period);
          const current = to.toLowerCase() === 'present';
          return (
            <article className="job" key={`${job.company}-${job.period}`}>
              <div className="job-when num">
                {current && <b>Now</b>}
                {job.period}
                {job.context && (
                  <div style={{ marginTop: 6, color: 'var(--ink-4)' }}>{job.context}</div>
                )}
              </div>

              <div>
                <h3 className="job-role">{job.role}</h3>
                <p className="job-co">
                  {job.url ? (
                    <a href={job.url} target="_blank" rel="noreferrer noopener">
                      {job.company}
                    </a>
                  ) : (
                    job.company
                  )}
                </p>
                <ul>
                  {job.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {hidden > 0 && !expanded && (
        <button className="disclose" onClick={() => setExpanded(true)}>
          Show {hidden} earlier {hidden === 1 ? 'role' : 'roles'}
        </button>
      )}
    </>
  );
}
