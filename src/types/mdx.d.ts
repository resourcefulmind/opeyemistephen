/**
 * Type definitions for MDX files
 * This declaration file enables TypeScript to understand .mdx imports
 */
declare module '*.mdx' {
  import React from 'react';
  import { PostStatus, Author } from '../lib/blog/types';
  
  /**
   * FrontMatter interface defines the structure of frontmatter in MDX files
   * This should match the structure in ValidatedPostMetadata from types.ts
   */
  export interface FrontMatter {
    /** The title of the blog post (required) */
    title: string;
    
    /** Publication date in ISO format (YYYY-MM-DD) (required) */
    date: string;
    
    /** Short summary of the post content (required) */
    excerpt: string;
    
    /** URL-friendly identifier for the post (required) */
    slug: string;
    
    /** List of keywords associated with the post (optional) */
    tags: string[];
    
    /** The person who wrote the post (string or detailed Author object) */
    author?: string | Author;
    
    /** Path to the cover image for the post (optional) */
    coverImage?: string;
    
    /** Original URL if this post was published elsewhere first (optional) */
    canonicalUrl?: string;
    
    /** Whether this post should be featured prominently (optional) */
    featured?: boolean;
    
    /** Estimated minutes to read the post (optional, can be calculated) */
    readingTime?: number;
    
    /** Last updated date in ISO format (optional) */
    lastUpdated?: string;
    
    /** Content publication status (optional, defaults to 'published') */
    status?: PostStatus;
    
    /** Whether the post is a draft and shouldn't be published (optional) */
    draft?: boolean;
    
    /** Catch-all for any additional custom frontmatter fields */
    [key: string]: any;
  }

  /**
   * The default export from an MDX file is a React component
   * that renders the content of the file
   */
  const MDXComponent: React.ComponentType<React.PropsWithChildren<{}>>;
  
  /**
   * The frontmatter export contains the metadata for the MDX file
   */
  export const frontmatter: FrontMatter;
  
  export default MDXComponent;
} 