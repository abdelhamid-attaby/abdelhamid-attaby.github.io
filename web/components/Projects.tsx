import { projects } from '@/content/cv';

export default function Projects() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">Things I have built.</h2>
        <p>
          Six pieces of work that show the range — agent platforms, developer
          tooling at scale, a research testbed, and the site you are reading.
        </p>
      </div>

      <div className="projects">
        {projects.map((p, i) => (
          <article className="project" key={p.title}>
            <div className="project-n num">{String(i + 1).padStart(2, '0')}</div>

            <div>
              <h3 className="h3">{p.title}</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: 15.5 }}>
                {p.subtitle}
              </p>
              <p className="project-when">
                {p.role} · {p.period}
              </p>
            </div>

            <div>
              <p className="project-desc" style={{ margin: 0 }}>{p.description}</p>
              <p className="project-stack">
                {p.stack.map((s, j) => (
                  <span className="nw" key={s}>
                    {s}
                    {j < p.stack.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
              {p.links.length > 0 && (
                <p className="project-links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener">
                      {l.label}
                    </a>
                  ))}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
