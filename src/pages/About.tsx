import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { intro, experience, skills, principles, story, now } from '../content/about.config';

const SECTION_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 }
} as const;

// Scroll indicator component
const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-foreground/50 tracking-wide">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-foreground/50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Cosmic background component for About page
const AboutCosmic = () => {
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

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl md:rounded-2xl border border-white/3 bg-secondary/8 backdrop-blur-xl',
        'shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] transition-all glass-card',
        className
      )}
    >
      {children}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <motion.section
      initial={SECTION_ANIMATION.initial}
      whileInView={SECTION_ANIMATION.whileInView}
      viewport={SECTION_ANIMATION.viewport}
      transition={SECTION_ANIMATION.transition}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-5 md:mb-8">
        <h2 className={cn('text-xs md:text-sm font-semibold mb-3 md:mb-6 tracking-wider')}>
          <span className="heading-accent">{title.toUpperCase()}</span>
        </h2>
        {description && (
          <p className="mt-2 md:mt-3 text-foreground/80 text-sm md:text-base lg:text-lg leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </motion.section>
  );
}

function Intro() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto text-center px-2"
    >
      <h1 className={cn('text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight mb-3 md:mb-4')}>
        <span className="heading-gradient">{intro.title}</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary/90 font-display">
        <span className="metallic-accent">{intro.tagline}</span>
      </p>
      <p className="mt-4 md:mt-6 text-foreground/80 leading-relaxed text-sm md:text-base">{intro.bio}</p>
    </motion.section>
  );
}

function NowFocus() {
  return (
    <Section title={now.title} description="Things I'm spending time on right now.">
      <GlassCard className="p-4 md:p-6 lg:p-8">
        <ul className="space-y-2 md:space-y-3 list-disc list-inside text-foreground/90 text-sm md:text-base">
          {now.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </GlassCard>
    </Section>
  );
}

function Experience() {
  return (
    <Section title="Worked with amazing dreamers and builders" description="Selected roles and impact across engineering and content.">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {experience.map((exp) => (
          <GlassCard key={exp.role} className="p-4 md:p-5 lg:p-6">
            <div className="flex items-start justify-between gap-2 md:gap-4">
              <div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-primary">{exp.role}</h3>
                <p className="text-foreground/80 text-xs md:text-sm">{exp.company}</p>
              </div>
              <span className="text-xs md:text-sm text-foreground/60 whitespace-nowrap">{exp.period}</span>
            </div>
            <ul className="mt-3 md:mt-4 space-y-1.5 md:space-y-2 list-disc list-inside text-foreground/90 text-xs md:text-sm">
              {exp.bullets.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section title="Skills & Tools" description="Grouped for clarity and skimmability.">
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {skills.map((group) => (
          <GlassCard key={group.group} className="p-4 md:p-5">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">{group.group}</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    'px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm',
                    'bg-secondary/20 text-primary border border-primary/10 backdrop-blur-sm'
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Values() {
  return (
    <Section title="Principles" description="Guides that shape how I build and collaborate.">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {principles.map((v) => (
          <GlassCard key={v.title} className="p-4 md:p-5 lg:p-6">
            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-primary">{v.title}</h3>
            <p className="mt-1.5 md:mt-2 text-foreground/80 leading-relaxed text-xs md:text-sm">{v.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Story() {
  return (
    <Section title={story.title} description="A short, honest introduction.">
      <GlassCard className="p-4 md:p-6 lg:p-8">
        <div className="space-y-3 md:space-y-4 text-foreground/90 leading-relaxed text-sm md:text-base">
          {story.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </GlassCard>
    </Section>
  );
}

function CallToAction() {
  return (
    <Section title="Let's make magic">
      <GlassCard className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-foreground/90 text-sm md:text-base">Have a project or idea? I'm open to collaborations and impactful work.</p>
          <div className="flex gap-2 md:gap-3">
            <a
              href="mailto:contact@example.com"
              className={cn('btn btn-ghost text-xs md:text-sm px-3 py-2 md:px-4')}
            >
              Email me
            </a>
            <a
              href="/blog"
              className={cn('btn btn-primary text-xs md:text-sm px-3 py-2 md:px-4')}
            >
              Read the blog
            </a>
          </div>
        </div>
      </GlassCard>
    </Section>
  );
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <AboutCosmic />
      <ScrollIndicator />
      <div className="relative z-10 space-y-10 md:space-y-16 pt-8 md:pt-12 pb-16 md:pb-20 px-4 sm:px-6 md:px-8">
        <Intro />
        <NowFocus />
        <Story />
        <Experience />
        <Skills />
        <Values />
        <CallToAction />
      </div>
    </div>
  );
}


