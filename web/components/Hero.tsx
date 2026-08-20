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
              <div className="win">
                <div className="win-bar">
                  <div className="win-dots">
                    <span /><span /><span />
                  </div>
                  <span className="win-title">whoami.sh</span>
                </div>
                <div className="whoami-body">
                  <div className="whoami-line avail-line">Open to senior &amp; staff roles</div>
                  <div className="whoami-line">
                    <span className="whoami-k">location</span>
                    <span className="whoami-v">New Cairo, Egypt</span>
                  </div>
                  <div className="whoami-line">
                    <span className="whoami-k">remote</span>
                    <span className="whoami-v">any timezone</span>
                  </div>
                  <div className="whoami-line">
                    <span className="whoami-k">links</span>
                    <span className="whoami-v">
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

      <div className="shell stats-win">
        <div className="win">
          <div className="win-bar">
            <div className="win-dots">
              <span /><span /><span />
            </div>
            <span className="win-title">career.stats</span>
          </div>
          <div className="win-body">
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
