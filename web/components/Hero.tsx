import { cv, LINKS } from '@/content/cv';

export default function Hero() {
  return (
    <>
      <section className="hero" id="top">
        <div className="shell">
          <div className="grid">
            <div className="hero-main">
              <p className="eyebrow">{cv.meta.title}</p>

              <h1 className="display">
                Abdelhamid
                <br />
                Attaby
              </h1>

              <hr className="rule-accent" />

              <p className="lede">
                Fifteen years building software. Two of them inside{' '}
                <strong>GitHub</strong>. Twice a CTO. Now building the systems
                that let <strong>AI agents</strong> build software.
              </p>

              <p className="hero-role">
                Founding Engineer at Flowdia <em>— multi-agent application platform</em>
              </p>
            </div>

            <div className="hero-side">
              <figure className="portrait">
                {/* Replace portrait.jpg with the face crop. object-position is
                    tuned for a head-and-shoulders frame. */}
                <img
                  src="/portrait.jpg"
                  alt="Abdelhamid Attaby, Senior Software Engineer"
                  width={640}
                  height={800}
                />
              </figure>

              <div className="portrait-meta">
                <span className="avail-line">Open to senior &amp; staff roles</span>
                <span>New Cairo, Egypt</span>
                <span>Remote — any timezone</span>
                <span style={{ marginTop: 8 }}>
                  <a href={LINKS.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
                  {' · '}
                  <a href={LINKS.github} target="_blank" rel="noreferrer noopener">GitHub</a>
                  {' · '}
                  <a href={LINKS.scholar} target="_blank" rel="noreferrer noopener">Scholar</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="band">
        <div className="shell">
          <div className="stats">
            {cv.stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-v num">{s.value}</div>
                <div className="stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
