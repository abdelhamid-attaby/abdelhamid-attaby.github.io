import type { ComponentType, SVGProps } from 'react';

interface Props {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}

/**
 * The page's one structural primitive: an icon-dot eyebrow, then the
 * content framed as a single rounded card. Every section uses it, so the
 * rhythm of the page is set in one place.
 */
export default function Section({ id, label, icon: Icon, children }: Props) {
  return (
    <section id={id} className="section">
      <div className="shell">
        <div className="section-eyebrow-wrap">
          <span className="eyebrow">
            <span className="eyebrow-dot"><Icon aria-hidden="true" /></span>
            {label}
          </span>
        </div>
        <div className="card card-pad">{children}</div>
      </div>
    </section>
  );
}
