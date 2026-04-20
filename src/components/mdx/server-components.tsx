import React from 'react';
import { Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import CodeBlock from './CodeBlock';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const Heading = ({
  level,
  children,
  id,
  ...props
}: {
  level: HeadingLevel;
  id?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) => {
  const headingId =
    id ||
    (typeof children === 'string'
      ? children.toLowerCase().replace(/\s+/g, '-')
      : undefined);

  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const styles = {
    1: 'text-3xl font-bold mt-10 mb-4',
    2: 'text-2xl font-bold mt-8 mb-3',
    3: 'text-xl font-bold mt-6 mb-2',
    4: 'text-lg font-bold mt-5 mb-2',
    5: 'text-base font-bold mt-4 mb-2',
    6: 'text-sm font-bold mt-3 mb-2',
  } as const;

  return (
    <HeadingTag
      id={headingId}
      className={`group relative flex items-center ${styles[level]}`}
      {...props}
    >
      {children}
      {headingId && (
        <a
          href={`#${headingId}`}
          className="absolute opacity-0 group-hover:opacity-100 ml-2 text-primary/50 hover:text-primary"
          aria-label="Link to this section"
        >
          #
        </a>
      )}
    </HeadingTag>
  );
};

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'tip';
  title?: string;
  children: React.ReactNode;
}

export const Callout = ({ type = 'info', title, children }: CalloutProps) => {
  const icons = {
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-amber-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    tip: <Lightbulb size={20} className="text-green-500" />,
  };

  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100',
    warning:
      'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100',
    error: 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-100',
    tip: 'bg-green-500/10 border-green-500/30 text-green-900 dark:text-green-100',
  };

  return (
    <div className={`p-4 my-6 rounded-lg border-l-4 ${styles[type]}`}>
      <div className="flex items-center gap-2 font-semibold mb-2">
        {icons[type]}
        {title || type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      <div>{children}</div>
    </div>
  );
};

export const GridLayout = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('blog-grid-layout', className)} {...props}>
    {children}
  </div>
);

export const GridColumn = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('blog-grid-column', className)} {...props}>
    {children}
  </div>
);

const Table = (props: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto my-8">
    <table className="min-w-full divide-y divide-primary/10" {...props} />
  </div>
);

const TableHead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-primary/5" {...props} />
);

const TableRow = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="even:bg-primary/5" {...props} />
);

const TableHeader = (
  props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>
) => (
  <th
    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
    {...props}
  />
);

const TableCell = (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td className="px-4 py-3 whitespace-nowrap" {...props} />
);

const Code = (
  props: React.HTMLAttributes<HTMLElement> & { className?: string }
) => {
  const isInline = !props.className;
  return isInline ? (
    <code
      {...props}
      className="bg-primary/10 px-1.5 py-0.5 rounded font-mono text-sm"
    />
  ) : (
    <CodeBlock {...props} />
  );
};

const Div = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props;

  if (className?.includes('blog-grid-layout')) {
    return <GridLayout {...rest} className={className} />;
  }
  if (className?.includes('blog-grid-column')) {
    return <GridColumn {...rest} className={className} />;
  }

  return <div className={className} {...rest} />;
};

export const serverComponents = {
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={1} {...p} />,
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={2} {...p} />,
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={3} {...p} />,
  h4: (p: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={4} {...p} />,
  h5: (p: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={5} {...p} />,
  h6: (p: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={6} {...p} />,

  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...p} className="my-4 leading-relaxed" />
  ),

  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...p}
      className="text-primary hover:underline"
      target={p.href?.startsWith('http') ? '_blank' : undefined}
      rel={p.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    />
  ),

  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...p} className="list-disc pl-5 my-4 space-y-2" />
  ),

  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...p} className="list-decimal pl-5 my-4 space-y-2" />
  ),

  li: (p: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...p} className="pl-1" />
  ),

  blockquote: (p: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...p}
      className="pl-4 border-l-4 border-primary/30 italic my-6 text-foreground/80"
    />
  ),

  hr: (p: React.HTMLAttributes<HTMLHRElement>) => (
    <hr {...p} className="my-8 border-t border-primary/20" />
  ),

  table: Table,
  thead: TableHead,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,

  code: Code,
  div: Div,

  Callout,
  GridLayout,
  GridColumn,
};
