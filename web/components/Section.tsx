interface Props {
  id: string;
  label: string;
  alt?: boolean;
  children: React.ReactNode;
}

/**
 * The page's one structural primitive: an eyebrow label in the left three
 * columns, and the content in the remaining nine framed as a plain bordered
 * panel. Every section uses it, so the rhythm of the page is set in one
 * place.
 */
export default function Section({ id, label, alt, children }: Props) {
  return (
    <section id={id} className={alt ? 'section alt' : 'section'}>
      <div className="shell">
        <div className="grid">
          <div className="section-label">
            <span className="eyebrow">{label}</span>
          </div>
          <div className="section-body">
            <div className="panel">
              <div className="panel-body">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
