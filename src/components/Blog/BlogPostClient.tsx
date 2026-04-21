'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type {
  BlogPost as BlogPostType,
  BlogPostPreview,
} from '../../lib/blog/types';
import MobileNavOverlay from './MobileNavOverlay';
import { useMobileNav } from '../../contexts/MobileNavContext';

type TagStat = { tag: string; count: number; label: string };

const FALLBACK_IMAGE =
  'https://placehold.co/600x400/1e293b/ffffff?text=Image+Not+Found';

const InlineTableOfContents = () => {
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const headingElements = document.querySelectorAll('h2, h3, h4');

      const items = Array.from(headingElements).map((el, index) => {
        const text = el.textContent || '';
        const id =
          el.id ||
          text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') ||
          `heading-${index}`;

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

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((entry) => entry.isIntersecting);
          if (entry) {
            setActiveId(entry.target.id);
          }
        },
        {
          rootMargin: '-80px 0px -80% 0px',
          threshold: 0,
        }
      );

      headingElements.forEach((el) => {
        if (el.id) observer.observe(el);
      });

      return () => {
        headingElements.forEach((el) => {
          if (el.id) observer.unobserve(el);
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

  if (headings.length === 0) return null;

  return (
    <div className="toc-sidebar-inline">
      <h3 className="toc-title">Table of Contents</h3>

      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`toc-item ${heading.level === 3 ? 'level-3' : ''} ${
                  activeId === heading.id ? 'active' : ''
                }`}
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

const BlogCosmic = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      stars.forEach((star) => star.remove());
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      ref={containerRef}
    >
      <div className="blog-nebula blog-nebula-primary"></div>
      <div className="blog-nebula blog-nebula-secondary"></div>
    </div>
  );
};

const ReadingProgress = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (currentProgress / scrollHeight) * 100)
        );
        setCompletion(progress);
      }
    };

    updateScrollCompletion();
    window.addEventListener('scroll', updateScrollCompletion, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return (
    <div className="reading-progress-container">
      <div className="reading-progress-bar" style={{ width: `${completion}%` }} />
    </div>
  );
};

const ReadingTime = ({ minutes }: { minutes: number }) => (
  <span className="flex items-center text-sm">
    <span className="w-1 h-1 bg-foreground/40 rounded-full mx-2 hide-xs"></span>
    <span>{minutes} min read</span>
  </span>
);

function PostNavigation({
  prev,
  next,
}: {
  prev: BlogPostPreview | null;
  next: BlogPostPreview | null;
}) {
  return (
    <nav className="blog-post-nav">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="blog-post-nav-item">
          <span className="blog-post-nav-label">Previous</span>
          <span className="blog-post-nav-title">
            ← {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div className="hide-mobile"></div>
      )}

      <Link
        href="/blog"
        className="blog-post-nav-item all-posts flex items-center justify-center"
      >
        All Posts
      </Link>

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="blog-post-nav-item text-right"
        >
          <span className="blog-post-nav-label">Next</span>
          <span className="blog-post-nav-title">
            {next.frontmatter.title} →
          </span>
        </Link>
      ) : (
        <div className="hide-mobile"></div>
      )}
    </nav>
  );
}

type BlogPostClientProps = {
  frontmatter: BlogPostType['frontmatter'];
  slug: string;
  prev: BlogPostPreview | null;
  next: BlogPostPreview | null;
  tagStats: TagStat[];
  popularPosts: BlogPostPreview[];
  recentPosts: BlogPostPreview[];
  children: React.ReactNode;
};

export default function BlogPostClient({
  frontmatter,
  slug,
  prev,
  next,
  tagStats,
  popularPosts,
  recentPosts,
  children,
}: BlogPostClientProps) {
  const router = useRouter();
  const { isMobileNavOpen, setIsMobileNavOpen } = useMobileNav();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  const { title, date, tags = [], readingTime = 5, coverImage } = frontmatter;

  const author = frontmatter.author
    ? typeof frontmatter.author === 'string'
      ? frontmatter.author
      : frontmatter.author.name
    : null;

  return (
    <>
      <ReadingProgress />

      <article className="blog-container pt-8 md:pt-16">
        <BlogCosmic />

        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 xl:pr-80 mb-8">
          <div className="blog-post-card glass-card p-4 sm:p-5 md:p-8">
            <header className="mb-4 md:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 blog-post-header leading-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center text-xs sm:text-sm text-foreground/70 mb-3 gap-x-2 md:gap-x-4 gap-y-1">
                <time dateTime={date} className="font-medium">
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>

                {author && (
                  <span className="flex items-center text-foreground/70">
                    <span className="w-1 h-1 bg-foreground/40 rounded-full mx-1.5 md:mx-2 hide-xs"></span>
                    by {author}
                  </span>
                )}

                <ReadingTime minutes={readingTime} />
              </div>

              {coverImage && (
                <div className="blog-cover-image mb-3 md:mb-4">
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
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="blog-tag text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="blog-content prose prose-sm md:prose dark:prose-invert max-w-none">
              {children}
            </div>

            <PostNavigation prev={prev} next={next} />
          </div>

          <InlineTableOfContents />
        </div>
      </article>

      <MobileNavOverlay
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        tagStats={tagStats}
        popularPosts={popularPosts}
        recentPosts={recentPosts}
        activeTag={null}
        onSelectTag={(tag) =>
          router.push(`/blog?tag=${encodeURIComponent(tag)}`)
        }
        onClear={() => router.push('/blog')}
      />
    </>
  );
}
