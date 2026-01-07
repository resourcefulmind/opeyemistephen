import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { principles, now } from '../content/about.config';
import { getAllPosts, getPopularPosts } from '../lib/blog/loader';
import { BlogPostPreview } from '../lib/blog/types';

const SECTION_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 }
} as const;

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl md:rounded-2xl border border-white/5 bg-secondary/10 backdrop-blur-xl',
        'shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] transition-all glass-card',
        className
      )}
    >
      {children}
    </div>
  );
}

function FeaturedPosts() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllPosts();
        const popular = getPopularPosts(allPosts, 3);
        setPosts(popular);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-secondary/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <motion.section
      initial={SECTION_ANIMATION.initial}
      whileInView={SECTION_ANIMATION.whileInView}
      viewport={SECTION_ANIMATION.viewport}
      transition={SECTION_ANIMATION.transition}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xs md:text-sm font-semibold tracking-wider">
          <span className="heading-accent">FEATURED POSTS</span>
        </h2>
        <Link
          to="/blog"
          className="text-xs md:text-sm text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`}>
            <GlassCard className="p-4 md:p-5 h-full hover:border-primary/20">
              <h3 className="text-base md:text-lg font-semibold text-primary mb-2 line-clamp-2">
                {post.frontmatter.title}
              </h3>
              <p className="text-xs md:text-sm text-foreground/60 mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                {post.frontmatter.excerpt}
              </p>
              <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-foreground/50">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {post.frontmatter.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.frontmatter.readingTime}
                  </span>
                )}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

function PrinciplesTeaser() {
  // Show first 3 principles
  const featuredPrinciples = principles.slice(0, 3);

  return (
    <motion.section
      initial={SECTION_ANIMATION.initial}
      whileInView={SECTION_ANIMATION.whileInView}
      viewport={SECTION_ANIMATION.viewport}
      transition={{ ...SECTION_ANIMATION.transition, delay: 0.1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xs md:text-sm font-semibold tracking-wider">
          <span className="heading-accent">PRINCIPLES</span>
        </h2>
        <Link
          to="/about"
          className="text-xs md:text-sm text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
        >
          See all <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {featuredPrinciples.map((principle) => (
          <GlassCard key={principle.title} className="p-4 md:p-5">
            <h3 className="text-sm md:text-base font-semibold text-primary mb-2">
              {principle.title}
            </h3>
            <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
              {principle.desc}
            </p>
          </GlassCard>
        ))}
      </div>
    </motion.section>
  );
}

function CurrentlySection() {
  // Show first 3 "now" items
  const currentItems = now.bullets.slice(0, 3);

  return (
    <motion.section
      initial={SECTION_ANIMATION.initial}
      whileInView={SECTION_ANIMATION.whileInView}
      viewport={SECTION_ANIMATION.viewport}
      transition={{ ...SECTION_ANIMATION.transition, delay: 0.2 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-xs md:text-sm font-semibold tracking-wider">
          <span className="heading-accent">CURRENTLY</span>
        </h2>
        <Link
          to="/about"
          className="text-xs md:text-sm text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
        >
          More about me <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>

      <GlassCard className="p-4 md:p-6">
        <ul className="space-y-2.5 md:space-y-3">
          {currentItems.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 md:gap-3 text-foreground/80 text-sm md:text-base"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 md:mt-2 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.section>
  );
}

export default function HomeContent() {
  return (
    <div className="relative z-10 space-y-12 md:space-y-20 py-12 md:py-24 px-4 sm:px-6 md:px-8">
      <FeaturedPosts />
      <PrinciplesTeaser />
      <CurrentlySection />
    </div>
  );
}
