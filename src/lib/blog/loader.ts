/**
 * Blog post loader module
 * 
 * This module contains functions for loading blog posts from MDX files.
 * It handles importing, validating, and processing blog content.
 */
import { BlogPost, BlogPostPreview, FrontmatterValidationError, RawFrontmatter } from "./types";
import { validateFrontmatter, calculateReadingTime } from "./schema";
import logger from "../utils/logger";

// Cache to avoid reloading posts on every request
let postsCache: BlogPostPreview[] | null = null;

/**
 * Gets all blog posts with their metadata
 * 
 * This function imports all MDX files from the articles directory,
 * validates their frontmatter, and returns them as BlogPostPreview objects.
 * Results are sorted by date (newest first) and filtered in production.
 * 
 * @param forceProduction Force production mode filtering (hide drafts/unpublished)
 * @returns Promise resolving to an array of blog post previews
 */
export async function getAllPosts(forceProduction = false): Promise<BlogPostPreview[]> {
    // Return cached posts if available
    if (postsCache) {
        return postsCache;
    }

    // Import all .mdx files from the articles directory using Vite's import.meta.glob
    const postFiles = import.meta.glob('../../content/articles/*.mdx', {
        eager: true,
    });

    logger.info("Found post files:", Object.keys(postFiles));

    const posts: BlogPostPreview[] = [];

    // Process each post file
    Object.entries(postFiles).forEach(([filepath, module]: [string, any]) => {
        // Extract slug from filename
        const slug = filepath
            .replace('../../content/articles/', '')
            .replace('.mdx', '');
        
        try {
            // Get raw frontmatter from the MDX module
            const rawFrontmatter: RawFrontmatter = module.frontmatter || {};
            
            // Add slug to frontmatter if not present (derive from filename)
            if (!rawFrontmatter.slug) {
                rawFrontmatter.slug = slug;
            }
            
            // Validate frontmatter against schema
            const validatedFrontmatter = validateFrontmatter(rawFrontmatter);
            
            // Create and add blog post preview to the list
            posts.push({
                frontmatter: validatedFrontmatter,
                slug,
            });
            
            logger.debug(`Processed post: ${slug}`);
        } catch (error) {
            // Handle validation errors separately for better error messages
            if (error instanceof FrontmatterValidationError) {
                logger.error(`Validation error in ${slug}: ${error.message}`);
            } else {
                logger.error(`Error processing post ${slug}:`, error);
            }
            // Skip invalid posts to prevent breaking the entire blog
        }
    });

    // Sort posts by date in descending order (newest first)
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - 
        new Date(a.frontmatter.date).getTime();
    });

    // Filter posts in production environment:
    // 1. Remove draft posts
    // 2. Only show posts with status=published or undefined status
    const isProduction = import.meta.env.PROD || forceProduction;
    const filteredPosts = isProduction 
        ? sortedPosts.filter(post => 
            !post.frontmatter.draft && 
            (post.frontmatter.status === undefined || post.frontmatter.status === 'published')
          )
        : sortedPosts.map(post => ({
            ...post,
            frontmatter: {
                ...post.frontmatter,
                // Add isDevelopmentOnly flag to indicate posts that wouldn't show in production
                isDevelopmentOnly: post.frontmatter.draft || 
                  (post.frontmatter.status !== undefined && post.frontmatter.status !== 'published')
            }
          }));

    // Cache the filtered posts for future requests
    postsCache = filteredPosts;
    return filteredPosts;
}

/**
 * Gets a single blog post by its slug
 * 
 * This function dynamically imports the specific MDX file for the requested post,
 * validates its frontmatter, and returns it as a complete BlogPost object.
 * 
 * @param slug - The URL-friendly identifier of the post
 * @returns Promise resolving to the blog post or null if not found/invalid
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    logger.info("Attempting to load post by slug:", slug);
    
    try {
        // Dynamic import of the specific MDX file
        // This leverages Vite's dynamic import capability
        const module = await import(`../../content/articles/${slug}.mdx`);
        logger.debug("Module loaded:", module);
        logger.debug("Module default:", module.default);
        logger.debug("Module frontmatter:", module.frontmatter);
        
        // Ensure the module has a default export (the content component)
        if (!module.default) {
            logger.error("No default export found in MDX module");
            return null;
        }

        // Get raw frontmatter from the MDX module
        const rawFrontmatter: RawFrontmatter = module.frontmatter || {};
        
        // Add slug to frontmatter if not present
        if (!rawFrontmatter.slug) {
            rawFrontmatter.slug = slug;
        }
        
        // Calculate reading time if not already provided
        if (!rawFrontmatter.readingTime && typeof module.default === 'function') {
            // Convert component to string for word count estimation
            // This isn't perfect but provides a reasonable estimate
            const contentStr = module.default.toString();
            rawFrontmatter.readingTime = calculateReadingTime(contentStr);
        }
        
        // Validate frontmatter against schema
        const validatedFrontmatter = validateFrontmatter(rawFrontmatter);
        
        // In production, filter out:
        // 1. Draft posts
        // 2. Posts with non-published status
        const isProduction = import.meta.env.PROD;
        if (isProduction && (
            validatedFrontmatter.draft || 
            (validatedFrontmatter.status !== undefined && validatedFrontmatter.status !== 'published')
        )) {
            logger.info(`Skipping non-published post in production: ${slug}`);
            return null;
        }
        
        // Return the complete blog post object
        return {
            content: module.default, 
            frontmatter: validatedFrontmatter, 
            slug, 
        };
    } catch (error) {
        // Handle errors appropriately
        if (error instanceof FrontmatterValidationError) {
            logger.error(`Validation error in ${slug}: ${error.message}`);
        } else {
            logger.error(`Failed to load post with slug ${slug}:`, error);
        }
        return null;
    }
}