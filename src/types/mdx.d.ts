declare module '*.mdx' {
  import React from 'react';
  
  export interface FrontMatter {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    [key: string]: any;
  }

  const MDXComponent: React.ComponentType<React.PropsWithChildren<{}>>;
  
  export const frontmatter: FrontMatter;
  export default MDXComponent;
} 