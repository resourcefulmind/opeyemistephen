import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import React, { cache } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

import {
  BlogPost,
  BlogPostPreview,
  FrontmatterValidationError,
  RawFrontmatter,
} from './types';
import { validateFrontmatter, calculateReadingTime } from './schema';
import { mdxComponents } from '@/components/mdx/mdxComponents';
import { popularSlugs } from '@/content/blog.config';
import logger from '../utils/logger';

const ARTICLES_DIR = path.join(process.cwd(), 'src/content/articles');

function isProductionRuntime(forceProduction: boolean) {
  return forceProduction || process.env.NODE_ENV === 'production';
}

async function readArticle(
  slug: string
): Promise<{ raw: string; filePath: string } | null> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return { raw, filePath };
  } catch {
    return null;
  }
}

export const getAllPosts = cache(
  async (forceProduction = false): Promise<BlogPostPreview[]> => {
    const entries = await fs.readdir(ARTICLES_DIR);
    const mdxFiles = entries.filter((e) => e.endsWith('.mdx'));

    const posts = await Promise.all(
      mdxFiles.map(async (filename): Promise<BlogPostPreview | null> => {
        const slug = filename.replace(/\.mdx$/, '');
        try {
          const filePath = path.join(ARTICLES_DIR, filename);
          const raw = await fs.readFile(filePath, 'utf8');
          const { data, content } = matter(raw);

          const rawFrontmatter: RawFrontmatter = { ...data };
          if (!rawFrontmatter.slug) rawFrontmatter.slug = slug;
          if (rawFrontmatter.readingTime === undefined) {
            rawFrontmatter.readingTime = calculateReadingTime(content);
          }

          const frontmatter = validateFrontmatter(rawFrontmatter);
          return { frontmatter, slug };
        } catch (error) {
          if (error instanceof FrontmatterValidationError) {
            logger.error(`Validation error in ${slug}: ${error.message}`);
          } else {
            logger.error(`Error processing post ${slug}:`, error);
          }
          return null;
        }
      })
    );

    const valid = posts.filter(
      (p): p is BlogPostPreview => p !== null
    );

    const sorted = valid.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

    const isProduction = isProductionRuntime(forceProduction);

    if (isProduction) {
      return sorted.filter(
        (post) =>
          !post.frontmatter.draft &&
          (post.frontmatter.status === undefined ||
            post.frontmatter.status === 'published')
      );
    }

    return sorted.map((post) => ({
      ...post,
      frontmatter: {
        ...post.frontmatter,
        isDevelopmentOnly:
          post.frontmatter.draft ||
          (post.frontmatter.status !== undefined &&
            post.frontmatter.status !== 'published'),
      },
    }));
  }
);

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const file = await readArticle(slug);
    if (!file) {
      logger.error(`Post not found: ${slug}`);
      return null;
    }

    try {
      const { data, content: body } = matter(file.raw);

      const rawFrontmatter: RawFrontmatter = { ...data };
      if (!rawFrontmatter.slug) rawFrontmatter.slug = slug;
      if (rawFrontmatter.readingTime === undefined) {
        rawFrontmatter.readingTime = calculateReadingTime(body);
      }

      const frontmatter = validateFrontmatter(rawFrontmatter);

      if (
        process.env.NODE_ENV === 'production' &&
        (frontmatter.draft ||
          (frontmatter.status !== undefined &&
            frontmatter.status !== 'published'))
      ) {
        return null;
      }

      const { content: mdxElement } = await compileMDX({
        source: body,
        components: mdxComponents,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
          },
        },
      });

      const Content: React.ComponentType = () => mdxElement;

      return {
        content: Content,
        frontmatter,
        slug,
        filePath: file.filePath,
      };
    } catch (error) {
      if (error instanceof FrontmatterValidationError) {
        logger.error(`Validation error in ${slug}: ${error.message}`);
      } else {
        logger.error(`Failed to load post with slug ${slug}:`, error);
      }
      return null;
    }
  }
);

export function getTagStats(
  posts: BlogPostPreview[]
): Array<{ tag: string; count: number; label: string }> {
  const counts = new Map<string, number>();
  const labels = new Map<string, string>();

  for (const post of posts) {
    const tags = post.frontmatter?.tags ?? [];
    const unique = new Set(tags.map((t) => t.trim()).filter(Boolean));

    for (const original of unique) {
      const key = original.toLowerCase();
      if (!labels.has(key)) labels.set(key, original);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const stats: Array<{ tag: string; count: number; label: string }> = [];
  for (const [tag, count] of counts.entries()) {
    stats.push({ tag, count, label: labels.get(tag)! });
  }

  stats.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  return stats;
}

function indexBySlug(
  posts: BlogPostPreview[]
): Map<string, BlogPostPreview> {
  const map = new Map<string, BlogPostPreview>();
  for (const post of posts) {
    map.set(post.slug, post);
  }
  return map;
}

function getPopularFromConfig(
  posts: BlogPostPreview[],
  slugs: readonly string[]
): BlogPostPreview[] {
  const bySlug = indexBySlug(posts);
  const result: BlogPostPreview[] = [];
  for (const slug of slugs) {
    const post = bySlug.get(slug);
    if (post) result.push(post);
  }
  return result;
}

function getPopularHeuristic(
  posts: BlogPostPreview[],
  limit = 6
): BlogPostPreview[] {
  const withDate = posts.filter((p) => !!p.frontmatter?.date);

  const featured = withDate
    .filter((p) => p.frontmatter?.featured === true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  const nonFeatured = withDate
    .filter((p) => p.frontmatter?.featured !== true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  const merged = [...featured, ...nonFeatured];

  const seen = new Set<string>();
  const unique: BlogPostPreview[] = [];
  for (const post of merged) {
    if (!seen.has(post.slug)) {
      seen.add(post.slug);
      unique.push(post);
    }
  }
  return unique.slice(0, limit);
}

export function getPopularPosts(
  posts: BlogPostPreview[],
  limit = 6
): BlogPostPreview[] {
  const curated = getPopularFromConfig(posts, popularSlugs);
  if (curated.length >= 1) {
    return curated.slice(0, limit);
  }
  return getPopularHeuristic(posts, limit);
}
