import { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { BlogPostPreview } from '../../lib/blog/types';

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  tagStats: Array<{ tag: string; count: number; label: string }>;
  popularPosts: BlogPostPreview[];
  recentPosts: BlogPostPreview[];
  activeTag: string | null;
  onSelectTag: (tag: string) => void;
  onClear: () => void;
}

export default function MobileNavOverlay({
  isOpen,
  onClose,
  tagStats,
  popularPosts,
  recentPosts,
  activeTag,
  onSelectTag,
  onClear,
}: MobileNavOverlayProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed top-20 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Overlay Panel */}
      <div
        className={cn(
          'fixed top-20 right-0 h-[calc(100vh-5rem)] w-full max-w-sm z-50 lg:hidden',
          'bg-secondary/95 backdrop-blur-xl',
          'border-l border-primary/10',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-xl font-semibold">
            <span className="heading-gradient">Browse Blog</span>
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 rounded-lg',
              'bg-secondary/20 backdrop-blur-sm',
              'border border-primary/10',
              'flex items-center justify-center',
              'transition-all duration-200',
              'hover:bg-secondary/30 hover:border-primary/20',
              'focus:outline-none focus:ring-2 focus:ring-primary/30'
            )}
            aria-label="Close navigation menu"
          >
            <svg
              className="w-4 h-4 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto h-full pb-20">
          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <span className="heading-accent">Browse by Category</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onClear();
                  onClose();
                }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm border transition-all',
                  activeTag === null
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'bg-secondary/20 text-foreground border-primary/10 hover:border-primary/20'
                )}
              >
                All
              </button>
              {tagStats.slice(0, 8).map(({ tag, label, count }) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      onSelectTag(tag);
                      onClose();
                    }}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm border transition-all',
                      isActive
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'bg-secondary/20 text-foreground border-primary/10 hover:border-primary/20'
                    )}
                  >
                    <span className="truncate max-w-[100px]">{label}</span>
                    <span className="ml-1 text-foreground/60">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Posts Section */}
          {popularPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <span className="heading-accent">Popular Posts</span>
              </h3>
              <div className="space-y-3">
                {popularPosts.slice(0, 4).map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block p-3 rounded-lg bg-secondary/20 border border-primary/10 hover:bg-secondary/30 transition-colors"
                    onClick={onClose}
                  >
                    <h4 className="text-sm font-medium text-primary line-clamp-2 leading-snug">
                      {post.frontmatter.title}
                    </h4>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts Section */}
          {recentPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <span className="heading-accent">Most Recent</span>
              </h3>
              <div className="space-y-3">
                {recentPosts.slice(0, 4).map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block p-3 rounded-lg bg-secondary/20 border border-primary/10 hover:bg-secondary/30 transition-colors"
                    onClick={onClose}
                  >
                    <h4 className="text-sm font-medium text-primary line-clamp-2 leading-snug">
                      {post.frontmatter.title}
                    </h4>
                    <p className="text-xs text-foreground/60 mt-1">
                      {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
