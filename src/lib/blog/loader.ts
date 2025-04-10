import { BlogPost, BlogPostPreview, FrontmatterValidationError, RawFrontmatter } from "./types";
import { validateFrontmatter, calculateReadingTime } from "./schema";

//store cached posts
let postsCache: BlogPostPreview[] | null = null;

export async function getAllPosts(): Promise<BlogPostPreview[]> {
    if (postsCache) {
        return postsCache;
    }

    //import all .mdx files from the articles directory
    const postFiles = import.meta.glob('../../content/articles/*.mdx', {
        eager: true,
    });

    console.log("Found post files:", Object.keys(postFiles));

    const posts: BlogPostPreview[] = [];

    // Process each post
    Object.entries(postFiles).forEach(([filepath, module]: [string, any]) => {
        //get slug from filename
        const slug = filepath
            .replace('../../content/articles/', '')
            .replace('.mdx', '');
        
        try {
            // Get raw frontmatter
            const rawFrontmatter: RawFrontmatter = module.frontmatter || {};
            
            // Add slug to frontmatter if not present
            if (!rawFrontmatter.slug) {
                rawFrontmatter.slug = slug;
            }
            
            // Validate frontmatter
            const validatedFrontmatter = validateFrontmatter(rawFrontmatter);
            
            // Create blog post preview
            posts.push({
                frontmatter: validatedFrontmatter,
                slug,
            });
            
            console.log(`Processed post: ${slug}`);
        } catch (error) {
            if (error instanceof FrontmatterValidationError) {
                console.error(`Validation error in ${slug}: ${error.message}`);
            } else {
                console.error(`Error processing post ${slug}:`, error);
            }
            // Skip invalid posts
        }
    });

    //sort posts by date in descending order
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - 
        new Date(a.frontmatter.date).getTime();
    });

    // Filter out draft posts in production
    const isProduction = import.meta.env.PROD;
    const filteredPosts = isProduction 
        ? sortedPosts.filter(post => !post.frontmatter.draft)
        : sortedPosts;

    postsCache = filteredPosts;
    return filteredPosts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    console.log("Attempting to load post by slug:", slug);
    
    try {
        //Dynamic import of the specific MDX file
        const module = await import(`../../content/articles/${slug}.mdx`);
        console.log("Module loaded:", module);
        console.log("Module default:", module.default);
        console.log("Module frontmatter:", module.frontmatter);
        
        if (!module.default) {
            console.error("No default export found in MDX module");
            return null;
        }

        // Get raw frontmatter
        const rawFrontmatter: RawFrontmatter = module.frontmatter || {};
        
        // Add slug to frontmatter if not present
        if (!rawFrontmatter.slug) {
            rawFrontmatter.slug = slug;
        }
        
        // Calculate reading time if not provided
        if (!rawFrontmatter.readingTime && typeof module.default === 'function') {
            // Approximate content length for reading time calculation
            // This is imperfect but provides a reasonable estimate
            const contentStr = module.default.toString();
            rawFrontmatter.readingTime = calculateReadingTime(contentStr);
        }
        
        // Validate frontmatter
        const validatedFrontmatter = validateFrontmatter(rawFrontmatter);
        
        // Check if this is a draft post in production
        const isProduction = import.meta.env.PROD;
        if (isProduction && validatedFrontmatter.draft) {
            console.log(`Skipping draft post in production: ${slug}`);
            return null;
        }
        
        return {
            content: module.default, 
            frontmatter: validatedFrontmatter, 
            slug, 
        };
    } catch (error) {
        if (error instanceof FrontmatterValidationError) {
            console.error(`Validation error in ${slug}: ${error.message}`);
        } else {
            console.error(`Failed to load post with slug ${slug}:`, error);
        }
        return null;
    }
}