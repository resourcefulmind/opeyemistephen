import { BlogPost, BlogPostPreview } from "./types";

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

    const posts = Object.entries(postFiles).map(([filepath, module]: [string, any]) => {
        //get slug from filename
        const slug = filepath
            .replace('../../content/articles/', '')
            .replace('.mdx', '');
        
        console.log("Processing post:", slug, "frontmatter:", module.frontmatter);
        
        return {
            frontmatter: {
                ...module.frontmatter, 
                slug, 
            }, 
            slug, 
        };
    });

    //sort posts by date in descending order
    const sortedPosts = posts.sort((a, b) => {
        return new Date(b.frontmatter.date).getTime() - 
        new Date(a.frontmatter.date).getTime();
    });

    postsCache = sortedPosts;
    return sortedPosts;
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

        return {
            content: module.default, 
            frontmatter: {
                ...module.frontmatter, 
                slug, 
            }, 
            slug, 
        };
    } catch (error) {
        console.error(`Failed to load post with slug ${slug}`, error);
        return null;
    }
}