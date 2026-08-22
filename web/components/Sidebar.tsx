import { asset } from '@/content/cv';
import { IconUser, IconFileText, IconFolder, IconQuote, IconBook, IconMail, IconDownload } from './Icons';

const SECTIONS = [
  { href: '#about', label: 'About', Icon: IconUser },
  { href: '#experience', label: 'Resume', Icon: IconFileText },
  { href: '#projects', label: 'Work', Icon: IconFolder },
  { href: '#recommendations', label: 'Recommendations', Icon: IconQuote },
  { href: '#research', label: 'Research', Icon: IconBook },
  { href: '#contact', label: 'Contact', Icon: IconMail },
];

export default function Sidebar() {
  // Bare "#about" only scrolls when the browser is already on the page that
  // has an #about element. From /chat/ (a separate exported route) it does
  // nothing, since there's no #about there — so every section link, and the
  // avatar, must point at the home route explicitly.
  const home = asset('/');

  return (
    <header className="sidebar">
      <a href={`${home}#top`} className="sidebar-avatar" aria-label="Abdelhamid Attaby — home">
        <img src={asset('/portrait.jpg')} alt="" width={44} height={44} />
      </a>

      <nav className="sidebar-nav" aria-label="Sections">
        {SECTIONS.map((s) => (
          <a key={s.href} href={`${home}${s.href}`}>
            <s.Icon aria-hidden="true" />
            {s.label}
          </a>
        ))}
      </nav>

      <a className="sidebar-cv" href={asset('/cv.pdf')} download aria-label="Download CV">
        <IconDownload aria-hidden="true" />
      </a>
    </header>
  );
}
