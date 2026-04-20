'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { BlogPostPreview } from '../../lib/blog/types';
import Sidebar from './SideBar';
import MobileNavOverlay from './MobileNavOverlay';
import { useMobileNav } from '../../contexts/MobileNavContext';

type TagStat = { tag: string; count: number; label: string };

type BlogListClientProps = {
  posts: BlogPostPreview[];
  tagStats: TagStat[];
  popularPosts: BlogPostPreview[];
};

const BlogListCosmic = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

export default function BlogListClient({
  posts,
  tagStats,
  popularPosts,
}: BlogListClientProps) {
  const [showAllPosts, setShowAllPosts] = useState(true);
  const { isMobileNavOpen, setIsMobileNavOpen } = useMobileNav();

  const router = useRouter();
  const pathname = usePathname() ?? '/blog';
  const searchParams = useSearchParams();
  const activeTag = searchParams?.get('tag')?.toLowerCase() || null;

  const isProduction = process.env.NODE_ENV === 'production';

  const basePosts = showAllPosts
    ? posts
    : posts.filter((post) => !post.frontmatter.isDevelopmentOnly);

  const visiblePosts = activeTag
    ? basePosts.filter((post) =>
        (post.frontmatter?.tags || [])
          .map((t) => t.toLowerCase())
          .includes(activeTag)
      )
    : basePosts;

  const recentPosts = basePosts.slice(0, 6);

  const goToTag = (tag: string) => {
    router.push(`${pathname}?tag=${encodeURIComponent(tag)}`);
  };

  const clearFilter = () => {
    router.push(pathname);
  };

  return (
    <div className="blog-container">
      <BlogListCosmic />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 text-center pt-4 md:pt-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            <span className="heading-gradient">Articles and Tutorials</span>
          </h1>
          <p className="text-foreground/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
            Thoughts, ideas, and insights on web development, technology, and
            design.
          </p>

          {!isProduction && (
            <div className="mt-6">
              <button
                onClick={() => setShowAllPosts(!showAllPosts)}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 transition-colors rounded-md text-sm font-medium"
              >
                {showAllPosts ? 'Show Production Posts Only' : 'Show All Posts'}
              </button>
            </div>
          )}
        </header>

        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 xl:gap-10">
          <div>
            <ul className="grid gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-8 px-1">
              {visiblePosts.map((post) => (
                <li
                  key={post.slug}
                  className="blog-post-card relative p-4 sm:p-5 md:p-6"
                >
                  {post.frontmatter.isDevelopmentOnly && (
                    <div className="absolute top-2 right-2 px-2 py-1 text-[10px] md:text-xs font-semibold bg-amber-600 text-white rounded-md">
                      Development Only
                    </div>
                  )}

                  <div className="flex flex-col h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary hover:underline block mb-2 leading-snug"
                    >
                      {post.frontmatter.title}
                    </Link>

                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-foreground/60 mb-2 md:mb-3">
                      <time
                        dateTime={post.frontmatter.date}
                        className="mr-2 md:mr-3"
                      >
                        {new Date(post.frontmatter.date).toLocaleDateString(
                          'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </time>

                      {post.frontmatter.readingTime && (
                        <span className="flex items-center">
                          <span className="w-1 h-1 bg-foreground/40 rounded-full mx-1.5 md:mx-2 hide-xs"></span>
                          {post.frontmatter.readingTime} min read
                        </span>
                      )}
                    </div>

                    <p
                      className="text-foreground/80 mb-3 md:mb-4 flex-grow text-sm md:text-base leading-relaxed"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.frontmatter.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary hover:underline text-xs md:text-sm font-medium"
                    >
                      Read more
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            {visiblePosts.length === 0 && (
              <div className="blog-post-card p-8 text-center mb-8">
                <h2 className="text-xl mb-2">No posts found</h2>
                <p>There are no blog posts available for this category.</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  {activeTag && (
                    <button onClick={clearFilter} className="btn btn-primary">
                      Clear filter
                    </button>
                  )}
                  <Link href="/" className="btn btn-ghost">
                    Go home
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block mt-10 lg:mt-0">
            <Sidebar
              tagStats={tagStats}
              popularPosts={popularPosts}
              recentPosts={recentPosts}
              activeTag={activeTag}
              onSelectTag={goToTag}
              onClear={clearFilter}
            />
          </div>
        </div>
      </div>

      <MobileNavOverlay
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        tagStats={tagStats}
        popularPosts={popularPosts}
        recentPosts={recentPosts}
        activeTag={activeTag}
        onSelectTag={goToTag}
        onClear={clearFilter}
      />
    </div>
  );
}
