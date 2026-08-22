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

      <div className="timeline">
        {roles.map((job) => {
          const { to } = splitPeriod(job.period);
          const current = to.toLowerCase() === 'present';
          return (
            <article className={current ? 'tl-item current' : 'tl-item'} key={`${job.company}-${job.period}`}>
              <span className="tl-dot" aria-hidden="true" />
              <span className="badge num">{job.period}</span>

              <h3 className="tl-role">{job.role}</h3>
              <p className="tl-co">
                {job.url ? (
                  <a href={job.url} target="_blank" rel="noreferrer noopener">
                    {job.company}
                  </a>
                ) : (
                  job.company
                )}
                {job.context ? ` · ${job.context}` : ''}
              </p>
              <ul>
                {job.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
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
