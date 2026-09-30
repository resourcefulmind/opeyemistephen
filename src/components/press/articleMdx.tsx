import Image from 'next/image';
import { Children, isValidElement } from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import PressCodeBlock from './PressCodeBlock';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

/** Visible text of a React node tree, for the section link's accessible name. */
function textOf(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return '';
}

/**
 * Heading with a "#" section link beside it. The link sits outside the heading, so a
 * screen reader's heading list reads only the heading text, and the link keeps its
 * own name ("Link to section: ...") for keyboard and pointer users alike.
 */
function AnchoredHeading({ as: Tag, id, children, ...props }: HeadingProps & { as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) {
  if (!id) return <Tag {...props}>{children}</Tag>;
  return (
    <div className={`hwrap hwrap-${Tag}`}>
      <Tag id={id} {...props}>
        {children}
      </Tag>
      <a href={`#${id}`} className="anchor" aria-label={`Link to section: ${textOf(children)}`}>
        #
      </a>
    </div>
  );
}

const CALLOUT = {
  info: { label: 'Note', Icon: Info },
  tip: { label: 'Tip', Icon: Lightbulb },
  warning: { label: 'Warning', Icon: AlertTriangle },
  error: { label: 'Careful', Icon: AlertCircle },
} as const;

function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: keyof typeof CALLOUT;
  title?: string;
  children: React.ReactNode;
}) {
  const { label, Icon } = CALLOUT[type] ?? CALLOUT.info;
  return (
    <aside className={`callout callout-${type}`}>
      <p className="callout-label">
        <Icon aria-hidden="true" />
        {title ?? label}
      </p>
      <div>{children}</div>
    </aside>
  );
}

function Figure({ src, alt = '', title, width, height }: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (typeof src !== 'string' || !src) return null;
  const w = Number(width) || 1600;
  const h = Number(height) || 900;
  return (
    <figure className="article-figure">
      <a href={src} target="_blank" rel="noopener noreferrer" aria-label={alt ? `Open full-size image: ${alt}` : 'Open full-size image'}>
        <Image src={src} alt={alt} width={w} height={h} sizes="(max-width: 820px) 100vw, 720px" />
      </a>
      {title ? <figcaption>{title}</figcaption> : null}
    </figure>
  );
}

/** Inline `code`. Fenced blocks never reach here: `pre` below renders them. */
function Code(props: React.HTMLAttributes<HTMLElement>) {
  return <code {...props} className={props.className ? `inline-code ${props.className}` : 'inline-code'} />;
}

/** Every fenced block is a <pre><code>; render it as one code block, language or not. */
function Pre({ children }: React.HTMLAttributes<HTMLPreElement>) {
  const child = Children.toArray(children)[0];
  if (isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
    return <PressCodeBlock {...child.props} />;
  }
  return <pre>{children}</pre>;
}

/**
 * Markdown wraps a lone image in a paragraph, and a <figure> inside a <p> is invalid
 * HTML (React then throws a hydration error). Paragraphs holding an image render as a
 * plain block instead.
 */
function Paragraph({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const holdsFigure = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === Figure
  );
  if (holdsFigure) return <div className="figure-block">{children}</div>;
  return <p {...props}>{children}</p>;
}

export const articleMdx = {
  p: Paragraph,
  // The page renders the only h1; a stray body h1 becomes an h2 so the outline stays valid.
  h1: (p: HeadingProps) => <AnchoredHeading as="h2" {...p} />,
  h2: (p: HeadingProps) => <AnchoredHeading as="h2" {...p} />,
  h3: (p: HeadingProps) => <AnchoredHeading as="h3" {...p} />,
  h4: (p: HeadingProps) => <AnchoredHeading as="h4" {...p} />,
  h5: (p: HeadingProps) => <AnchoredHeading as="h5" {...p} />,
  h6: (p: HeadingProps) => <AnchoredHeading as="h6" {...p} />,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const external = p.href?.startsWith('http');
    return <a {...p} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} />;
  },
  pre: Pre,
  code: Code,
  img: Figure,
  table: (p: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table">
      <table {...p} />
    </div>
  ),
  Callout,
  GridLayout: (p: React.HTMLAttributes<HTMLDivElement>) => <div {...p} className="blog-grid-layout" />,
  GridColumn: (p: React.HTMLAttributes<HTMLDivElement>) => <div {...p} className="blog-grid-column" />,
};
