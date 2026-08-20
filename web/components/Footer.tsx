import { asset, LINKS } from '@/content/cv';
import ToptalBadge from './ToptalBadge';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <h4>Abdelhamid Attaby</h4>
            <p className="footer-say">
              Senior software engineer, Ph.D. Distributed systems, technical
              leadership, and the engineering behind AI agents.
            </p>
          </div>

          <div className="footer-links">
            <h4>This site</h4>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href={asset('/chat/')}>Ask my CV</a>
          </div>

          <div className="footer-links">
            <h4>Elsewhere</h4>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
            <a href={LINKS.github} target="_blank" rel="noreferrer noopener">GitHub</a>
            <a href={LINKS.scholar} target="_blank" rel="noreferrer noopener">Google Scholar</a>
            <a href={LINKS.toptal} target="_blank" rel="noreferrer noopener">Toptal</a>
          </div>

          <div>
            <ToptalBadge />
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Abdelhamid Attaby</span>
          <span>Static on GitHub Pages · assistant on Vercel · free models via OpenRouter</span>
        </div>
      </div>
    </footer>
  );
}
