import { cv, LINKS } from '@/content/cv';

function parsePublication(entry: string) {
  // "Title. Venue, vol (year)." → { title, venue }
  const idx = entry.indexOf('. ');
  if (idx === -1) return { title: entry, venue: '' };
  return { title: entry.slice(0, idx), venue: entry.slice(idx + 2).replace(/\.$/, '') };
}

export default function Research() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">Ph.D.-level foundations.</h2>
        <p>{cv.publications.intro.replace(/:$/, '.')}</p>
      </div>

      <div className="split">
        <div>
          <a
            className="citations"
            href={LINKS.scholar}
            target="_blank"
            rel="noreferrer noopener"
          >
            124 citations on Google Scholar
          </a>

          {cv.publications.items.map((item) => {
            const { title, venue } = parsePublication(item);
            return (
              <div className="entry" key={title}>
                <div className="entry-t">{title}</div>
                <div className="entry-v">{venue}</div>
              </div>
            );
          })}

          <p style={{ fontSize: 14.5, color: 'var(--ink-2)', marginTop: 20 }}>
            {cv.publications.interests}
          </p>
        </div>

        <div>
          {cv.education.map((e) => (
            <div className="entry" key={e.degree}>
              <div className="entry-t">{e.degree}</div>
              <div className="entry-m">{e.school}</div>
              <div className="entry-m">{e.period}</div>
            </div>
          ))}

          <h3 className="eyebrow" style={{ display: 'block', margin: '34px 0 14px' }}>
            Certifications
          </h3>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0, lineHeight: 1.8 }}>
            {cv.certifications.join(' · ')}
          </p>
        </div>
      </div>
    </>
  );
}
