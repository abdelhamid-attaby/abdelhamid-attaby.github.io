interface Props {
  id: string;
  label: string;
  file: string;
  alt?: boolean;
  children: React.ReactNode;
}

/**
 * The page's one structural primitive: a hairline-margin eyebrow in the left
 * three columns, and the content in the remaining nine framed as a terminal
 * window — title bar with traffic lights, filename-style title, padded body.
 * Every section uses it, so the rhythm of the page is set in one place.
 */
export default function Section({ id, label, file, alt, children }: Props) {
  return (
    <section id={id} className={alt ? 'section alt' : 'section'}>
      <div className="shell">
        <div className="grid">
          <div className="section-label">
            <span className="eyebrow">{label}</span>
          </div>
          <div className="section-body">
            <div className="win">
              <div className="win-bar">
                <div className="win-dots">
                  <span /><span /><span />
                </div>
                <span className="win-title">{file}</span>
              </div>
              <div className="win-body">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
