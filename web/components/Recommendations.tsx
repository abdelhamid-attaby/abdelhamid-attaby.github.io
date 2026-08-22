import { asset, recommendations } from '@/content/cv';
import { IconQuote } from './Icons';

export default function Recommendations() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">What people say.</h2>
        <p>LinkedIn recommendations from managers, reports, and teammates.</p>
      </div>

      <div className="recs">
        {recommendations.map((r) => (
          <article className="card rec" key={r.name}>
            <span className="rec-mark"><IconQuote aria-hidden="true" /></span>
            <div className="rec-person">
              <span className="rec-avatar">
                <img src={asset(r.photo)} alt={r.name} width={42} height={42} loading="lazy" />
              </span>
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
