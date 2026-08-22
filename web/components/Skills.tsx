import { Fragment } from 'react';
import { cv, SKILL_ORDER } from '@/content/cv';
import { IconSparkle, IconCode, IconServer, IconLayout, IconDatabase, IconCloud, IconLayers } from './Icons';

const ICON: Record<string, typeof IconSparkle> = {
  'AI / LLM': IconSparkle,
  Languages: IconCode,
  Backend: IconServer,
  Frontend: IconLayout,
  Databases: IconDatabase,
  'Cloud & DevOps': IconCloud,
  Practices: IconLayers,
};

/**
 * Skills as icon service-cards rather than a wall of pills. Each entry is
 * nowrap so "Ruby on Rails" never splits across lines; the separator sits
 * outside the span, as its own text node, so the line can still break
 * between entries.
 */
export default function Skills() {
  return (
    <>
      <div className="section-head" style={{ marginTop: 44 }}>
        <h2 className="h2">The stack, end to end.</h2>
        <p>
          Everything here is something I have shipped with in production. AI &amp;
          agents is where most of my work sits today.
        </p>
      </div>

      <div className="service-grid">
        {SKILL_ORDER.map(({ key, label, lead }) => {
          const items = cv.skills[key];
          if (!items?.length) return null;
          const Icon = ICON[key] ?? IconLayers;
          return (
            <div className={lead ? 'card service-card lead' : 'card service-card'} key={key}>
              <div className="service-icon">
                <Icon aria-hidden="true" />
              </div>
              <h3>{label}</h3>
              <div className="service-list">
                {items.map((s, i) => (
                  <Fragment key={s}>
                    <span className="nw">{s}</span>
                    {i < items.length - 1 ? ', ' : ''}
                  </Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
