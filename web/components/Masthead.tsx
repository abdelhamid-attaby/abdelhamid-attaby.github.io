import { asset } from '@/content/cv';

const SECTIONS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Research' },
  { href: '#contact', label: 'Contact' },
];

export default function Masthead() {
  return (
    <header className="masthead">
      <div className="shell">
        <div className="masthead-in">
          <a href="#top" className="wordmark">
            Abdelhamid Attaby <span>Ph.D.</span>
          </a>

          <nav className="nav" aria-label="Sections">
            {SECTIONS.map((s) => (
              <a key={s.href} href={s.href}>{s.label}</a>
            ))}
          </nav>

          <a className="nav-cv" href={asset('/cv.pdf')} download>
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
