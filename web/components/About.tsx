import { cv } from '@/content/cv';

export default function About() {
  return (
    <>
      <div className="section-head">
        <h2 className="h2">Engineer, twice CTO, now building agents.</h2>
      </div>

      <div className="about-grid">
        <div className="prose about-cols">
          <p>
            Senior software engineer with <strong>fifteen years</strong> building,
            shipping and operating medium-to-large-scale applications — including
            two years at <strong>GitHub (Microsoft)</strong> contributing to one of
            the world&rsquo;s largest monolithic codebases.
          </p>
          <p>
            Since 2023 I have channelled that experience into startups and applied
            AI: co-founding an early-stage venture, then joining a multi-agent AI
            application platform as a <strong>founding engineer</strong> — building
            production agentic products hands-on rather than supervising them.
          </p>
          <p>
            Full-stack strength across Node.js, TypeScript, Ruby on Rails, React,
            Go and Elixir, with deep experience in microservices, distributed
            systems, API design and CI/CD, and a daily AI-assisted engineering
            practice.
          </p>
          <p>
            A proven technical leader — <strong>twice CTO</strong> — who has
            architected platforms, led engineering teams and mentored engineers
            from early-career to senior. I hold M.Sc. and Ph.D. degrees in
            Computer Science and Engineering, and I am reading for an MBA at AAST.
          </p>
        </div>

        <div className="card">
          <div className="card-pad" style={{ padding: 24 }}>
            <div className="fact-grid">
              <div className="info-row">
                <span className="info-k">Location</span>
                <span className="info-v">{cv.meta.location}</span>
              </div>
              <div className="info-row">
                <span className="info-k">Work</span>
                <span className="info-v">{cv.meta.remote}</span>
              </div>
              <div className="info-row">
                <span className="info-k">Availability</span>
                <span className="info-v">Open to opportunities</span>
              </div>
              <div className="info-row">
                <span className="info-k">Education</span>
                <span className="info-v">Ph.D., Computer Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="strengths">
        {cv.strengths.map((s, i) => (
          <div className="strength-row" key={s.title}>
            <div className="strength-n num">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <div className="strength-t">{s.title}</div>
              <div className="strength-d">{s.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
