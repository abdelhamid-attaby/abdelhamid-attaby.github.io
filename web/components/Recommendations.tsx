import { recommendations } from '@/content/cv';

export default function Recommendations() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">What people say.</h2>
        <p>LinkedIn recommendations from managers, reports, and teammates.</p>
      </div>

      <div className="recs">
        {recommendations.map((r) => (
          <article className="rec" key={r.name}>
            <div className="rec-person">
              <span className="rec-avatar" aria-hidden="true">{r.initials}</span>
              <div>
                <div className="rec-name">{r.name}</div>
                <div className="rec-role">{r.role}</div>
                <div className="rec-context">
                  {r.context} · {r.date}
                </div>
              </div>
            </div>

            <div className="rec-quote">
              {r.quote.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
