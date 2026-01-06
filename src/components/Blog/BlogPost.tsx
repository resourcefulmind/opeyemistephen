import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BlogPost as BlogPostType, BlogPostPreview } from "../../lib/blog/types";
import { getPostBySlug, getAllPosts } from "../../lib/blog/loader";
import MDXComponents from "../MDXComponents";
import BlogPostSEO from "../SEO/BlogPostSEO";

// Inline Table of Contents component
const InlineTableOfContents = () => {
  const [headings, setHeadings] = useState<Array<{id: string, text: string, level: number}>>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Wait for content to be rendered
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('h2, h3, h4');
      
      const items = Array.from(headingElements).map((el, index) => {
        const text = el.textContent || '';
        const id = el.id || text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          || `heading-${index}`;
        
        // Set ID if it doesn't exist
        if (!el.id) {
          el.id = id;
        }
        
        return {
          id,
          text: text.replace(/#/g, ''),
          level: parseInt(el.tagName.charAt(1)),
        };
      });

      setHeadings(items);

      // Set up intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries.find(entry => entry.isIntersecting);
          if (entry) {
            setActiveId(entry.target.id);
          }
        },
        {
          rootMargin: '-80px 0px -80% 0px',
          threshold: 0,
        }
      );

      headingElements.forEach(el => {
        if (el.id) {
          observer.observe(el);
        }
      });

      return () => {
        headingElements.forEach(el => {
          if (el.id) {
            observer.unobserve(el);
          }
        });
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="toc-sidebar-inline">
      <h3 className="toc-title">
        Table of Contents
      </h3>
      
      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`toc-item ${heading.level === 3 ? 'level-3' : ''} ${activeId === heading.id ? 'active' : ''}`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Fallback image URL for broken images
const FALLBACK_IMAGE = "https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Found";

// Blog cosmic background component
const BlogCosmic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Add twinkling stars
    const starCount = 160;
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

// Reading progress bar component
const ReadingProgress = () => {
  const [completion, setCompletion] = useState(0);
  
  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100));
        setCompletion(progress);
      }
    };
    
    // Initial calculation
    updateScrollCompletion();
    
    window.addEventListener('scroll', updateScrollCompletion, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);
  
  return (
    <div className="reading-progress-container">
      <div 
        className="reading-progress-bar" 
        style={{width: `${completion}%`}}
      />
    </div>
  );
};

// Reading time display
const ReadingTime = ({ minutes }: { minutes: number }) => (
  <span className="flex items-center text-sm">
    <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2 hide-xs"></span>
    <span>{minutes} min read</span>
  </span>
);

// Enhanced skeleton for blog post content with staggered loading
const PostSkeleton = () => (
  <div 
    className="blog-container max-w-3xl mx-auto pt-20"
    role="status"
    aria-live="polite"
  >
    <BlogCosmic />
    
    <div className="blog-post-card glass-card blog-skeleton-shine p-8">
      {/* Cover image skeleton */}
      <div className="w-full h-[200px] bg-primary/10 rounded-lg blog-skeleton-pulse mb-8"></div>
      
      {/* Title skeleton */}
      <div className="h-10 bg-primary/20 rounded-lg w-3/4 mb-4 blog-skeleton-pulse"></div>
      
      {/* Author and date skeleton */}
      <div className="flex items-center mb-6">
        <div className="h-4 bg-primary/20 rounded w-32 blog-skeleton-pulse"></div>
        <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2"></span>
        <div className="h-4 bg-primary/20 rounded w-24 blog-skeleton-pulse"></div>
        <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2"></span>
        <div className="h-4 bg-primary/20 rounded w-20 blog-skeleton-pulse"></div>
      </div>
      
      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2 mb-8" style={{ animationDelay: '100ms' }}>
        <div className="h-6 bg-primary/20 rounded-full w-16 blog-skeleton-pulse"></div>
        <div className="h-6 bg-primary/20 rounded-full w-16 blog-skeleton-pulse"></div>
        <div className="h-6 bg-primary/20 rounded-full w-16 blog-skeleton-pulse"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4" style={{ animationDelay: '200ms' }}>
        {/* Paragraph skeletons - staggered with animation delay */}
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded w-5/6 blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        
        {/* Heading skeleton */}
        <div className="h-6 bg-primary/20 rounded w-1/2 blog-skeleton-pulse mt-8 mb-4"></div>
        
        {/* More paragraphs */}
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded blog-skeleton-pulse"></div>
        <div className="h-4 bg-primary/20 rounded w-11/12 blog-skeleton-pulse"></div>
      </div>
      
      {/* Post navigation skeleton */}
      <div className="h-16 bg-primary/10 rounded-lg blog-skeleton-pulse mt-12" style={{ animationDelay: '300ms' }}></div>
      
      <span className="sr-only">Loading blog post content...</span>
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
        // For nav, we always load all posts so we can navigate between draft/dev posts too
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
        <div className="hide-mobile"></div>
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
        <div className="hide-mobile"></div>
      )}
    </nav>
  );
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle image errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };
  
  useEffect(() => {
    async function loadPost() {
      if (!slug) {
        navigate('/blog');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const postData = await getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error('Failed to load post:', error);
        setError('This post could not be loaded. It may not exist or there was an error.');
      } finally {
        setLoading(false);
      }
    }
    
    loadPost();
  }, [slug, navigate]);
  
  if (loading) {
    return <PostSkeleton />;
  }
  
  if (error || !post) {
    return (
      <div className="blog-container max-w-3xl mx-auto text-center pt-20 mb-8">
        <BlogCosmic />
        <div className="blog-post-card glass-card p-8">
          <h1 className="text-2xl font-bold text-destructive mb-4">Post Not Found</h1>
          <p className="mb-6">{error || "We couldn't find the blog post you're looking for."}</p>
          <Link to="/blog" className="inline-block px-6 py-3 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  // Extract content and frontmatter
  const { frontmatter, content: PostContent } = post;
  const { 
    title, 
    date, 
    tags = [], 
    readingTime = 5,
    coverImage,
  } = frontmatter;
  
  // Properly handle author which can be string or object
  const author = frontmatter.author 
    ? (typeof frontmatter.author === 'string' 
        ? frontmatter.author 
        : frontmatter.author.name)
    : null;

  return (
    <>
      <BlogPostSEO post={post} />
      
      <ReadingProgress />
      
      <article className="blog-container pt-20">
        <BlogCosmic />
        
        <div className="max-w-6xl mx-auto px-6 xl:pr-80 mb-8">
          <div className="blog-post-card glass-card p-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 blog-post-header">{title}</h1>
            
            <div className="flex flex-wrap items-center text-foreground/70 mb-4 space-x-2 md:space-x-4">
              <time dateTime={date} className="font-medium">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {author && (
                <span className="flex items-center text-foreground/70">
                  <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2 hide-xs"></span>
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
                  className="w-full h-auto rounded-lg object-contain"
                  onError={handleImageError}
                  loading="lazy"
                  data-transition-id={`cover-image-${slug}`}
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
          
          {/* Fixed Table of Contents */}
          <InlineTableOfContents />
        </div>
      </article>
    </>
  );
}
