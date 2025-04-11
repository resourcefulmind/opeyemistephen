import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BlogPostPreview } from "../../lib/blog/types";
import { getAllPosts } from "../../lib/blog/loader";
import { Helmet } from "react-helmet";

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

export default function BlogList() {
    const [posts, setPosts] = useState<BlogPostPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPosts() {
            try {
                console.log("Fetching all posts...");
                const allPosts = await getAllPosts();
                console.log("Posts loaded:", allPosts);
                setPosts(allPosts);
                setLoading(false);
            } catch (err) {
                console.error("Error loading posts:", err);
                setError(
                    "Failed to load posts at this time...wanna check your network connection"
                );
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    return (
        <div className="blog-container min-h-screen">
            <Helmet>
                <title>Blog | My Portfolio</title>
                <meta name="description" content="Read my latest thoughts and articles on web development, design, and technology." />
            </Helmet>
            
            <BlogListCosmic />
            
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-5xl font-display font-bold mb-3 text-primary blog-post-header inline-block">Blog</h1>
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
                        {posts.map((post) => (
                            <li key={post.slug} className="blog-post-card p-6">
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
