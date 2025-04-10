import React from 'react';

/**
 * PostMetadata defines the structure of frontmatter for blog posts.
 * This schema ensures consistency across all blog content.
 */
export interface PostMetadata {
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
  
  /** The person who wrote the post (optional, defaults to site author) */
  author?: string;
  
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
  
  /** Whether the post is a draft and shouldn't be published (optional) */
  draft?: boolean;
}

/**
 * ValidatedPostMetadata extends PostMetadata and ensures all fields are
 * properly validated and normalized according to the schema.
 */
export interface ValidatedPostMetadata extends PostMetadata {
  // All properties are guaranteed to be valid after validation
}

/**
 * Raw frontmatter data before validation
 */
export type RawFrontmatter = Record<string, any>;

/**
 * Complete blog post with content and metadata
 */
export interface BlogPost {
  /** React component containing the post content */
  content: React.ComponentType;
  
  /** Validated metadata from frontmatter */
  frontmatter: ValidatedPostMetadata;
  
  /** URL-friendly identifier */
  slug: string;
}

/**
 * Blog post preview (without full content) for listings
 */
export interface BlogPostPreview {
  /** Validated metadata from frontmatter */
  frontmatter: ValidatedPostMetadata;
  
  /** URL-friendly identifier */
  slug: string;
}

/**
 * Validation error for frontmatter
 */
export class FrontmatterValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'FrontmatterValidationError';
  }
}