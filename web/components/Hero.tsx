import { asset, cv, LINKS } from '@/content/cv';
import { IconDownload, IconSend, IconLinkedIn, IconGitHub, IconGraduation, IconExternal } from './Icons';

export default function Hero() {
  const home = asset('/');

  return (
    <>
      <section className="hero" id="top">
        <div className="shell">
          <div className="grid">
            <div className="hero-photo-col" style={{ gridColumn: '1 / 5' }}>
              <div className="card hero-photo-card">
                <div className="hero-terminal" aria-hidden="true">
                  <div className="term-bar"><span /><span /><span /></div>
                  <div className="term-body">
                    <p className="term-line"><span className="term-accent">$</span>&nbsp;agent.deploy(&quot;flowdia&quot;)</p>
                    <p className="term-line">&nbsp;&nbsp;→ provisioning postgres…</p>
                    <p className="term-line">&nbsp;&nbsp;→ shipping api + backend…</p>
                    <p className="term-line"><span className="term-accent">$</span>&nbsp;status: shipped ✓</p>
                  </div>
                </div>
                <div className="hero-photo">
                  <img
                    src={asset('/portrait.jpg')}
                    alt="Abdelhamid Attaby, Staff Software Engineer"
                    width={168}
                    height={168}
                  />
                </div>
                <div className="hero-id">
                  <h1>Abdelhamid Attaby</h1>
                  <p className="hero-role-line">{cv.meta.title}</p>
                  <span className="badge avail-line" style={{ marginTop: 12 }}>Open to Staff &amp; Senior roles</span>
                  <div className="hero-socials">
                    <a href={LINKS.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                      <IconLinkedIn aria-hidden="true" />
                    </a>
                    <a href={LINKS.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
                      <IconGitHub aria-hidden="true" />
                    </a>
                    <a href={LINKS.scholar} target="_blank" rel="noreferrer noopener" aria-label="Google Scholar">
                      <IconGraduation aria-hidden="true" />
                    </a>
                    <a href={LINKS.toptal} target="_blank" rel="noreferrer noopener" aria-label="Toptal">
                      <IconExternal aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <div className="hero-actions">
                  <a href={asset('/cv.pdf')} download>
                    <IconDownload aria-hidden="true" /> Download CV
                  </a>
                  <a href={`${home}#contact`}>
                    <IconSend aria-hidden="true" /> Contact Me
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-main" style={{ gridColumn: '5 / 13' }}>
              <span className="eyebrow">Staff Software Engineer, Ph.D.</span>

              <h2 className="display">
                Building the systems that let <strong style={{ color: 'var(--accent)' }}>AI agents</strong> build
                software.
              </h2>

              <p className="lede" style={{ maxWidth: '60ch', marginTop: 18 }}>
                Fifteen years building software. Two of them inside <strong>GitHub</strong>. Twice a CTO. Now a
                founding engineer at <strong>Flowdia</strong>, a multi-agent application platform — remote, any
                timezone, based in New Cairo, Egypt.
              </p>

              <div className="card" style={{ marginTop: 32 }}>
                <div className="card-pad" style={{ padding: '24px 28px' }}>
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
          </div>
        </div>
      </section>
    </>
  );
}
