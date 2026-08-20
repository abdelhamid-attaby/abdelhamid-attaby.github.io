import type { Metadata } from 'next';
import { cv, LINKS, SITE } from '@/content/cv';

// Fonts are self-hosted through Fontsource rather than fetched from Google.
// Two reasons: the site keeps working with no third-party request on every
// page load, and GitHub Pages serves the woff2 files straight off its own CDN.
import '@fontsource-variable/archivo';
import '@fontsource-variable/source-serif-4';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: '%s — Abdelhamid Attaby',
  },
  description: SITE.description,
  keywords: [
    'Abdelhamid Attaby',
    'senior software engineer',
    'staff software engineer',
    'AI engineer',
    'AI agents',
    'agentic AI',
    'distributed systems',
    'ex-GitHub engineer',
    'Elixir',
    'TypeScript',
    'remote software engineer',
  ],
  authors: [{ name: 'Abdelhamid Attaby', url: SITE.url }],
  creator: 'Abdelhamid Attaby',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: 'Abdelhamid Attaby',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Abdelhamid Attaby, Senior Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

/**
 * Person schema. Deliberately carries no `email` or `telephone` property —
 * structured data is machine-readable by design, so putting a contact detail
 * here would undo the whole privacy stance.
 */
function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cv.meta.name,
    honorificSuffix: 'Ph.D.',
    jobTitle: cv.meta.title,
    description: cv.about,
    url: SITE.url,
    image: `${SITE.url}/portrait.jpg`,
    address: { '@type': 'PostalAddress', addressLocality: 'New Cairo', addressCountry: 'EG' },
    worksFor: { '@type': 'Organization', name: 'Flowdia', url: 'https://flowdia.ai' },
    alumniOf: cv.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    knowsAbout: Object.values(cv.skills).flat(),
    sameAs: [LINKS.linkedin, LINKS.github, LINKS.scholar, LINKS.toptal].filter(Boolean),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
