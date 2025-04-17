import React, { useState, useRef, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import 'highlight.js/styles/github-dark.css'; // Import highlight.js styles
import { ClipboardCopy, Check, Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import TableOfContents from './Blog/TableOfContents';

// Code block with copy functionality
const CodeBlock = ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const language = className ? className.replace('language-', '') : '';
  
  const copyToClipboard = () => {
    if (codeRef.current) {
      const code = codeRef.current.textContent || '';
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="relative group my-8">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-md bg-primary/20 hover:bg-primary/30 transition-colors text-white"
          aria-label="Copy code to clipboard"
        >
          {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
        </button>
      </div>
      
      {language && (
        <div className="absolute left-0 top-0 px-3 py-1 text-xs font-mono text-white bg-gray-700 rounded-br-md z-10">
          {language}
        </div>
      )}
      
      <pre className="rounded-lg overflow-x-auto p-6 pt-10 bg-[#1e293b] text-white border border-gray-700 shadow-lg">
        <code ref={codeRef} className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

// Image component with zoom capability
const ImageComponent = ({ src, alt, title, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isZoomed, setIsZoomed] = useState(false);
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  return (
    <figure className="my-8">
      <div 
        className={cn(
          "relative overflow-hidden rounded-lg cursor-zoom-in transition-all duration-300",
          isZoomed && "cursor-zoom-out"
        )}
        onClick={toggleZoom}
      >
        <img
          src={src}
          alt={alt || ''}
          className={cn(
            "w-full h-auto transition-all duration-300", 
            isZoomed && "scale-150"
          )}
          {...props}
        />
      </div>
      {title && <figcaption className="text-sm text-center mt-2 text-foreground/70 italic">{title}</figcaption>}
    </figure>
  );
};

// Custom callout component with multiple types
interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'tip';
  title?: string;
  children: React.ReactNode;
}

const Callout = ({ type = 'info', title, children }: CalloutProps) => {
  const icons = {
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertTriangle size={20} className="text-amber-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    tip: <Lightbulb size={20} className="text-green-500" />
  };
  
  const styles = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100",
    error: "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-100",
    tip: "bg-green-500/10 border-green-500/30 text-green-900 dark:text-green-100"
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

// Grid layout components for MDX
const GridLayout = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("blog-grid-layout", className)} {...props}>
      {children}
    </div>
  );
};

const GridColumn = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("blog-grid-column", className)} {...props}>
      {children}
    </div>
  );
};

// Table component with responsive design
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

const TableHeader = (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" {...props} />
);

const TableCell = (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
  <td className="px-4 py-3 whitespace-nowrap" {...props} />
);

// Enhanced heading with automatic ID and anchor link
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
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const styles = {
    1: "text-3xl font-bold mt-10 mb-4",
    2: "text-2xl font-bold mt-8 mb-3",
    3: "text-xl font-bold mt-6 mb-2",
    4: "text-lg font-bold mt-5 mb-2",
    5: "text-base font-bold mt-4 mb-2",
    6: "text-sm font-bold mt-3 mb-2"
  };
  
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

// Custom components for MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={1} {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={2} {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={3} {...props} />,
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={4} {...props} />,
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={5} {...props} />,
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={6} {...props} />,
  
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => 
    <p {...props} className="my-4 leading-relaxed" />,
  
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => 
    <a {...props} className="text-primary hover:underline" target={props.href?.startsWith('http') ? '_blank' : undefined} rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined} />,
  
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => 
    <ul {...props} className="list-disc pl-5 my-4 space-y-2" />,
  
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => 
    <ol {...props} className="list-decimal pl-5 my-4 space-y-2" />,
  
  li: (props: React.HTMLAttributes<HTMLLIElement>) => 
    <li {...props} className="pl-1" />,
  
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => 
    <blockquote {...props} className="pl-4 border-l-4 border-primary/30 italic my-6 text-foreground/80" />,
  
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => 
    <hr {...props} className="my-8 border-t border-primary/20" />,
  
  img: ImageComponent,
  
  table: Table,
  thead: TableHead,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,
  
  // Use a function to conditionally render inline code vs code blocks
  code: (props: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const isInlineCode = !props.className;
    return isInlineCode 
      ? <code {...props} className="bg-primary/10 px-1.5 py-0.5 rounded font-mono text-sm" />
      : <CodeBlock {...props} />;
  },
  
  // Custom components
  Callout,
  TableOfContents,
  
  // Handle div with grid layout class name
  div: (props: React.HTMLAttributes<HTMLDivElement>) => {
    const { className, ...rest } = props;
    
    if (className?.includes('blog-grid-layout')) {
      return <GridLayout {...rest} className={className} />;
    }
    
    if (className?.includes('blog-grid-column')) {
      return <GridColumn {...rest} className={className} />;
    }
    
    return <div className={className} {...rest} />;
  }
};

interface MDXComponentsProps {
  children: React.ReactNode;
  frontmatter?: Record<string, any>;
}

export function MDXComponents({ children, frontmatter }: MDXComponentsProps) {
  return (
    <MDXProvider components={components}>
      <div className="mdx-content">
        {children}
      </div>
    </MDXProvider>
  );
}

export default MDXComponents; 