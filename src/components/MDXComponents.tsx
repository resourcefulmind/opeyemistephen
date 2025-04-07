import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import 'highlight.js/styles/github-dark.css'; // Import highlight.js styles

// Custom components for MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => 
    <h1 {...props} className="text-3xl font-bold my-4" />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => 
    <h2 {...props} className="text-2xl font-bold my-3" />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => 
    <h3 {...props} className="text-xl font-bold my-2" />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => 
    <p {...props} className="my-2" />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => 
    <ul {...props} className="list-disc ml-4 my-2" />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => 
    <ol {...props} className="list-decimal ml-4 my-2" />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => 
    <a {...props} className="text-blue-500 hover:underline" />,
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Inline code vs. code blocks
    const isInline = typeof props.children === 'string';
    return isInline 
      ? <code {...props} className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-sm" />
      : <code {...props} className="block rounded-md p-4 my-4 overflow-x-auto" />;
  },
  // Add more custom components as needed
};

interface MDXComponentsProps {
  children: React.ReactNode;
}

export function MDXComponents({ children }: MDXComponentsProps) {
  return (
    <MDXProvider components={components}>
      <div className="mdx-content">
        {children}
      </div>
    </MDXProvider>
  );
}

export default MDXComponents; 