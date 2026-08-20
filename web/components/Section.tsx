interface Props {
  id: string;
  label: string;
  alt?: boolean;
  children: React.ReactNode;
}

/**
 * The page's one structural primitive: a hairline rule, a sticky label in the
 * left three columns, content in the remaining nine. Every section uses it, so
 * the rhythm of the page is set in one place.
 */
export default function Section({ id, label, alt, children }: Props) {
  return (
    <section id={id} className={alt ? 'section alt' : 'section'}>
      <div className="shell">
        <div className="grid">
          <div className="section-label">
            <span className="eyebrow">{label}</span>
          </div>
          <div className="section-body">{children}</div>
        </div>
      </div>
    </section>
  );
}
