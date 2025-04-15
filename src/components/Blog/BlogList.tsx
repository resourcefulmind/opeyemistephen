import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BlogPostPreview } from "../../lib/blog/types";
import { getAllPosts } from "../../lib/blog/loader";
import { Helmet } from "react-helmet";
import logger from '../../lib/utils/logger';

// Blog Stars Background Component
const BlogListCosmic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Add twinkling stars
    const starCount = 60;
    const stars: HTMLDivElement[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'blog-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty('--twinkle-duration', `${Math.random() * 3 + 1}s`);
      container.appendChild(star);
      stars.push(star);
    }
    
    return () => {
      stars.forEach(star => star.remove());
    };
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" ref={containerRef}>
      <div className="blog-nebula blog-nebula-primary"></div>
      <div className="blog-nebula blog-nebula-secondary"></div>
    </div>
  );
};

// Blog post card skeleton loader
const BlogPostSkeleton = () => (
  <div className="blog-post-card blog-skeleton-shine p-6 opacity-70">
    <div className="h-7 bg-primary/20 rounded w-3/4 mb-4 blog-skeleton-pulse"></div>
    <div className="h-4 bg-primary/20 rounded w-full mb-3 blog-skeleton-pulse"></div>
    <div className="h-4 bg-primary/20 rounded w-5/6 mb-3 blog-skeleton-pulse"></div>
    <div className="flex gap-2 mt-3">
      <div className="h-6 w-16 bg-primary/20 rounded-full blog-skeleton-pulse"></div>
      <div className="h-6 w-20 bg-primary/20 rounded-full blog-skeleton-pulse"></div>
    </div>
  </div>
);

// Fallback image URL for broken images
const FALLBACK_IMAGE = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Found";

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPostPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State to toggle between showing all posts and production-only posts
    const [showAllPosts, setShowAllPosts] = useState(true);
    
    // Check if we're in production mode
    const isProduction = import.meta.env.PROD;

    useEffect(() => {
        async function loadPosts() {
            try {
                logger.info("Fetching all posts...");
                // In production, we don't need to add the isDevelopmentOnly flag
                // since those posts are already filtered out
                const allPosts = await getAllPosts(isProduction);
                logger.debug("Posts loaded:", allPosts);
                setPosts(allPosts);
                setLoading(false);
            } catch (err) {
                logger.error("Error loading posts:", err);
                setError(
                    "Failed to load posts at this time...wanna check your network connection"
                );
                setLoading(false);
            }
        }

        loadPosts();
    }, [isProduction]);

    // Handle image loading errors
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = FALLBACK_IMAGE;
    };

    // Toggle between all posts and production-only posts
    const togglePostsView = () => {
        setShowAllPosts(!showAllPosts);
    };

    // Filter posts if needed
    const filteredPosts = showAllPosts 
        ? posts 
        : posts.filter(post => !post.frontmatter.isDevelopmentOnly);

    return (
        <div className="blog-container min-h-screen">
            <Helmet>
                <title>Blog | My Portfolio</title>
                <meta name="description" content="Read my latest thoughts and articles on web development, design, and technology." />
            </Helmet>
            
            <BlogListCosmic />
            
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-5xl font-display font-bold text-primary blog-post-header inline-block">Blog</h1>
                    
                    {/* Only show toggle button in development mode */}
                    {!isProduction && (
                        <button 
                            onClick={togglePostsView}
                            className="px-3 py-1.5 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            {showAllPosts ? "Show Production Posts Only" : "Show All Posts"}
                        </button>
                    )}
                </div>
                
                <p className="text-foreground/70 text-lg mb-12">Thoughts, ideas, and explorations in technology</p>
                
                {loading ? (
                    <div className="space-y-6">
                        <BlogPostSkeleton />
                        <BlogPostSkeleton />
                        <BlogPostSkeleton />
                    </div>
                ) : error ? (
                    <div className="blog-post-card p-8 text-center text-destructive">
                        <h2 className="text-xl mb-2">Error loading posts</h2>
                        <p>{error}</p>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {filteredPosts.map((post) => (
                            <li key={post.slug} className="blog-post-card p-6 relative">
                                {/* Development-only badge */}
                                {post.frontmatter.isDevelopmentOnly && (
                                    <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-amber-600 text-white rounded-md">
                                        Development Only
                                    </div>
                                )}
                                
                                <Link to={`/blog/${post.slug}`} className="text-xl font-bold text-primary hover:underline block mb-2">
                                    {post.frontmatter.title}
                                </Link>
                                
                                <div className="flex items-center text-sm text-foreground/60 mb-3">
                                    <time dateTime={post.frontmatter.date}>
                                        {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                    
                                    {post.frontmatter.readingTime && (
                                        <span className="ml-3">{post.frontmatter.readingTime} min read</span>
                                    )}
                                </div>
                                
                                <p className="text-foreground/80 mb-4">{post.frontmatter.excerpt}</p>
                                
                                {post.frontmatter.coverImage && (
                                    <div className="blog-cover-image mb-4 h-48 w-full">
                                        <img 
                                            src={post.frontmatter.coverImage}
                                            alt={post.frontmatter.title}
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {post.frontmatter.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="blog-tag"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
