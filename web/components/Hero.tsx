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

              <p className="lede caret">
                Fifteen years building software. Two of them inside{' '}
                <strong>GitHub</strong>. Twice a CTO. Now building the systems
                that let <strong>AI agents</strong> build software.
              </p>

              <p className="hero-role">
                Founding Engineer at Flowdia <em>— multi-agent application platform</em>
              </p>
            </div>

            <div className="hero-side">
              <div className="panel">
                <div className="info-panel">
                  <div className="info-line avail-line">Open to senior &amp; staff roles</div>
                  <div className="info-line">
                    <span className="info-k">Location</span>
                    <span className="info-v">New Cairo, Egypt</span>
                  </div>
                  <div className="info-line">
                    <span className="info-k">Remote</span>
                    <span className="info-v">any timezone</span>
                  </div>
                  <div className="info-line">
                    <span className="info-k">Links</span>
                    <span className="info-v">
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
          </div>
        </div>
      </section>

      <div className="shell stats-panel">
        <div className="panel">
          <div className="panel-body">
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
      </div>
    </>
  );
}
