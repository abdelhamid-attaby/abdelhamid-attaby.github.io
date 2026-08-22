import { Fragment } from 'react';
import { asset, projects } from '@/content/cv';
import {
  IconSparkle,
  IconLayout,
  IconCode,
  IconActivity,
  IconWifi,
  IconGlobe,
  IconTrendingUp,
  IconMoon,
  IconGraduation,
  IconShoppingBag,
  IconLeaf,
  IconArrowRight,
} from './Icons';

const ICON: Record<string, typeof IconSparkle> = {
  Flowdia: IconSparkle,
  'GitHub Projects': IconLayout,
  Bardy: IconCode,
  'Grow Healthy': IconActivity,
  WiPi: IconWifi,
  Wuilt: IconGlobe,
  Aster: IconTrendingUp,
  'Simple Habit': IconMoon,
  'Coligo Technologies': IconGraduation,
  Zyda: IconShoppingBag,
  AYR: IconLeaf,
};

// One of five dark cover tints, cycling by index — visual rhythm across the
// grid without introducing new content-bearing accent colours.
const COVERS = ['c1', 'c2', 'c3', 'c4', 'c5'];

export default function Projects() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">Things I have built.</h2>
        <p>
          Selected work across agent platforms, fintech, EdTech, developer
          tooling at scale, and a research testbed.
        </p>
      </div>

      <div className="work-grid">
        {projects.map((p, i) => {
          const Icon = ICON[p.title] ?? IconCode;
          return (
            <article className="card work-card" key={p.title}>
              {p.image ? (
                <div className="work-cover has-image">
                  <img src={asset(p.image)} alt={`${p.title} — ${p.subtitle}`} loading="lazy" />
                </div>
              ) : (
                <div className={`work-cover ${COVERS[i % COVERS.length]}`}>
                  <Icon aria-hidden="true" />
                </div>
              )}

              {p.title === 'Flowdia' && (
                <div className="flow-diagram">
                  <div className="flow-step">
                    <b>Product intent</b>
                    natural language
                  </div>
                  <span className="flow-arrow"><IconArrowRight aria-hidden="true" /></span>
                  <div className="flow-step">
                    <b>Agent orchestration</b>
                    plan · build · ship
                  </div>
                  <span className="flow-arrow"><IconArrowRight aria-hidden="true" /></span>
                  <div className="flow-step">
                    <b>Deployed app</b>
                    backend + DB + APIs
                  </div>
                </div>
              )}

              <div className="work-body">
                <h3 className="h3">{p.title}</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: 14.5 }}>{p.subtitle}</p>
                <p className="work-when">{p.period ? `${p.role} · ${p.period}` : p.role}</p>

                <p className="work-desc">{p.description}</p>

                <p className="work-stack">
                  {/* The separator sits outside the nowrap span, as its own text
                      node, so the browser has a break opportunity between stack
                      entries — otherwise the whole list is one unbreakable run. */}
                  {p.stack.map((s, j) => (
                    <Fragment key={s}>
                      <span className="nw">{s}</span>
                      {j < p.stack.length - 1 ? ' · ' : ''}
                    </Fragment>
                  ))}
                </p>

                {p.links.length > 0 && (
                  <p className="work-links">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer noopener">
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
