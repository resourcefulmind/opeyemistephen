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
const BlogPostSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="blog-post-card blog-skeleton-shine p-6" 
    style={{ animationDelay: `${delay}ms` }}
    role="status"
    aria-live="polite"
  >
    <div className="md:flex md:items-start">
      {/* Skeleton for the cover image */}
      <div className="md:w-1/3 md:mr-6 mb-4 md:mb-0 h-[150px] bg-primary/10 rounded-lg blog-skeleton-pulse"></div>
      
      <div className="md:w-2/3">
        {/* Title skeleton */}
        <div className="h-7 bg-primary/20 rounded w-3/4 mb-4 blog-skeleton-pulse"></div>
        
        {/* Date and reading time skeleton */}
        <div className="flex items-center mb-3">
          <div className="h-4 bg-primary/20 rounded w-24 blog-skeleton-pulse"></div>
          <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2 hide-xs"></span>
          <div className="h-4 bg-primary/20 rounded w-20 blog-skeleton-pulse"></div>
        </div>
        
        {/* Excerpt skeleton lines */}
        <div className="h-4 bg-primary/20 rounded w-full mb-3 blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded w-5/6 mb-3 blog-skeleton-pulse"></div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="h-6 w-16 bg-primary/20 rounded-full blog-skeleton-pulse"></div>
          <div className="h-6 w-20 bg-primary/20 rounded-full blog-skeleton-pulse"></div>
          <div className="h-6 w-14 bg-primary/20 rounded-full blog-skeleton-pulse"></div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading blog post...</span>
  </div>
);

// Fallback image URL for broken images
const FALLBACK_IMAGE = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Found";

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPostPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAllPosts, setShowAllPosts] = useState(true);
    
    // Image error handler
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = FALLBACK_IMAGE;
    };
    
    // Only in development: toggle between all posts and production posts
    const isProduction = import.meta.env.PROD;
    const filteredPosts = showAllPosts ? posts : posts.filter(post => !post.frontmatter.isDevelopmentOnly);
    
    useEffect(() => {
        async function loadPosts() {
            try {
                setLoading(true);
                setError(null);
                const allPosts = await getAllPosts(isProduction);
                setPosts(allPosts);
            } catch (error) {
                logger.error('Failed to load posts:', error);
                setError('Failed to load blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        
        loadPosts();
    }, [isProduction]);
    
    return (
        <div className="blog-container">
            <BlogListCosmic />
            
            <Helmet>
                <title>Blog | My Portfolio</title>
                <meta name="description" content="Read my latest articles and thoughts on web development, technology, and more." />
            </Helmet>
            
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">My Blog</h1>
                    <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
                        Thoughts, ideas, and insights on web development, technology, and design.
                    </p>
                    
                    {!isProduction && (
                        <div className="mt-6">
                            <button 
                                onClick={() => setShowAllPosts(!showAllPosts)}
                                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors rounded-md text-sm font-medium"
                            >
                                {showAllPosts ? "Show Production Posts Only" : "Show All Posts"}
                            </button>
                        </div>
                    )}
                </header>
                
                {loading ? (
                    <div className="space-y-6" aria-label="Loading blog posts">
                        <BlogPostSkeleton delay={0} />
                        <BlogPostSkeleton delay={150} />
                        <BlogPostSkeleton delay={300} />
                    </div>
                ) : error ? (
                    <div className="blog-post-card p-8 text-center text-destructive">
                        <h2 className="text-xl mb-2">Error loading posts</h2>
                        <p>{error}</p>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {filteredPosts.map((post) => (
                            <li key={post.slug} className="blog-post-card relative">
                                {/* Development-only badge */}
                                {post.frontmatter.isDevelopmentOnly && (
                                    <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-amber-600 text-white rounded-md">
                                        Development Only
                                    </div>
                                )}
                                
                                <div className="md:flex md:items-start">
                                    {post.frontmatter.coverImage && (
                                        <div className="blog-cover-image md:w-1/3 md:mr-6 mb-4 md:mb-0">
                                            <img 
                                                src={post.frontmatter.coverImage}
                                                alt={post.frontmatter.title}
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={handleImageError}
                                                loading="lazy"
                                                data-transition-id={`cover-image-${post.slug}`}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className={post.frontmatter.coverImage ? "md:w-2/3" : "w-full"}>
                                        <Link to={`/blog/${post.slug}`} className="text-xl md:text-2xl font-bold text-primary hover:underline block mb-2">
                                            {post.frontmatter.title}
                                        </Link>
                                        
                                        <div className="flex flex-wrap items-center text-sm text-foreground/60 mb-3">
                                            <time dateTime={post.frontmatter.date} className="mr-3">
                                                {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                            
                                            {post.frontmatter.readingTime && (
                                                <span className="flex items-center">
                                                    <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2 hide-xs"></span>
                                                    {post.frontmatter.readingTime} min read
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-foreground/80 mb-4">{post.frontmatter.excerpt}</p>
                                        
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
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                
                {!loading && filteredPosts.length === 0 && (
                    <div className="blog-post-card p-8 text-center">
                        <h2 className="text-xl mb-2">No posts found</h2>
                        <p>There are no blog posts available at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
