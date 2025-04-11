import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BlogPost as BlogPostType, BlogPostPreview } from "../../lib/blog/types";
import { getPostBySlug, getAllPosts } from "../../lib/blog/loader";
import MDXComponents from "../MDXComponents";
import { Helmet } from "react-helmet";

// Blog cosmic background component
const BlogCosmic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Add twinkling stars
    const starCount = 40;
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

// Reading progress indicator component
const ReadingProgress = () => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setWidth(progress);
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);
  
  return (
    <div className="reading-progress-container">
      <div className="reading-progress-bar" style={{ width: `${width}%` }}></div>
    </div>
  );
};

// Placeholder for skeleton loading animation
const PostSkeleton = () => (
  <div className="blog-container max-w-3xl mx-auto">
    <BlogCosmic />
    <div className="p-6 blog-skeleton-shine">
      <div className="h-10 bg-primary/20 rounded w-3/4 mb-4 blog-skeleton-pulse"></div>
      <div className="h-4 bg-primary/20 rounded w-1/4 mb-6 blog-skeleton-pulse"></div>
      <div className="flex gap-2 mb-8">
        <div className="h-6 bg-primary/20 rounded w-16 blog-skeleton-pulse"></div>
        <div className="h-6 bg-primary/20 rounded w-16 blog-skeleton-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded w-5/6 blog-skeleton-pulse"></div>
      </div>
    </div>
  </div>
);

// Post not found component
const PostNotFound = () => (
  <div className="blog-container max-w-3xl mx-auto">
    <BlogCosmic />
    <div className="text-center py-12 blog-post-card p-8">
      <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
      <p className="mb-6 text-foreground/80">
        The blog post you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/blog" 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors hover:shadow-lg hover:shadow-primary/20"
      >
        Back to Blog
      </Link>
    </div>
  </div>
);

// Post Navigation component
const PostNavigation = ({ currentSlug }: { currentSlug: string }) => {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to load navigation posts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading || posts.length === 0) {
    return null;
  }

  // Find current post index
  const currentIndex = posts.findIndex(post => post.slug === currentSlug);
  if (currentIndex === -1) return null;

  // Get previous and next posts
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <nav className="blog-post-nav">
      {prevPost ? (
        <Link 
          to={`/blog/${prevPost.slug}`} 
          className="blog-post-nav-item"
        >
          <span className="blog-post-nav-label">Previous</span>
          <span className="blog-post-nav-title">← {prevPost.frontmatter.title}</span>
        </Link>
      ) : (
        <div></div>
      )}

      <Link 
        to="/blog" 
        className="blog-post-nav-item all-posts flex items-center justify-center"
      >
        All Posts
      </Link>

      {nextPost ? (
        <Link 
          to={`/blog/${nextPost.slug}`} 
          className="blog-post-nav-item text-right"
        >
          <span className="blog-post-nav-label">Next</span>
          <span className="blog-post-nav-title">{nextPost.frontmatter.title} →</span>
        </Link>
      ) : (
        <div></div>
      )}
    </nav>
  );
};

// Reading time display
const ReadingTime = ({ minutes }: { minutes?: number }) => {
  if (!minutes) return null;
  
  return (
    <span className="text-foreground/60 text-sm">
      {minutes} min read
    </span>
  );
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when slug changes
    setLoading(true);
    setError(null);
    setPost(null);
    
    async function loadPost() {
      if (!slug) {
        setError("No slug provided");
        setLoading(false);
        return;
      }
      
      try {
        const postData = await getPostBySlug(slug);
        
        if (!postData) {
          setError("Post not found");
          setLoading(false);
          return;
        }
        
        setPost(postData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load post:", error);
        setError("Failed to load post");
        setLoading(false);
      }
    }
    
    loadPost();
  }, [slug, navigate]);

  if (loading) {
    return <PostSkeleton />;
  }

  if (error || !post) {
    return <PostNotFound />;
  }

  const PostContent = post.content;
  const { title, date, tags, readingTime, author, coverImage } = post.frontmatter;

  return (
    <>
      <Helmet>
        <title>{title} | My Blog</title>
        <meta name="description" content={post.frontmatter.excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={post.frontmatter.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={date} />
        <meta property="article:tag" content={tags.join(', ')} />
        {coverImage && <meta property="og:image" content={coverImage} />}
      </Helmet>
      
      <ReadingProgress />
      
      <article className="blog-container">
        <BlogCosmic />
        
        <div className="blog-post-card p-6 max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-6 blog-post-header">{title}</h1>
            
            <div className="flex items-center flex-wrap text-foreground/70 mb-4 space-x-4">
              <time dateTime={date} className="font-medium">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {author && (
                <span className="text-foreground/70">
                  by {author}
                </span>
              )}
              
              <ReadingTime minutes={readingTime} />
            </div>
            
            {coverImage && (
              <div className="blog-cover-image mb-6 mt-4">
                <img 
                  src={coverImage} 
                  alt={title} 
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            )}
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="blog-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <div className="blog-content prose dark:prose-invert max-w-none">
            <MDXComponents frontmatter={post.frontmatter}>
              <PostContent />
            </MDXComponents>
          </div>
          
          <PostNavigation currentSlug={slug!} />
        </div>
      </article>
    </>
  );
}
