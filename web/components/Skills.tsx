import { Fragment } from 'react';
import { cv, SKILL_ORDER } from '@/content/cv';

/**
 * Skills as a table rather than a wall of pills. Reads faster, prints well,
 * and avoids the chip-soup that every generated portfolio has.
 */
export default function Skills() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">The stack, end to end.</h2>
        <p>
          Everything here is something I have shipped with in production. The
          first row is where most of my work sits today.
        </p>
      </div>

      <div className="skills">
        {SKILL_ORDER.map(({ key, label, lead }) => {
          const items = cv.skills[key];
          if (!items?.length) return null;
          return (
            <div className={lead ? 'skill-row lead' : 'skill-row'} key={key}>
              <div className="skill-cat">{label}</div>
              {/* Each entry is nowrap so "Ruby on Rails" never splits across
                  lines; the comma sits outside it so the line can still break
                  between entries. */}
              <div className="skill-list">
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
