import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { intro, experience, skills, principles, story, now } from '../content/about.config';

const SECTION_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 }
} as const;

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/10 bg-secondary/20 backdrop-blur-sm',
        'shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow glass-card',
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
      <div className="mb-8">
        <h2 className={cn('text-3xl md:text-4xl font-display font-semibold tracking-tight leading-tight')}>
          <span className="heading-accent">{title}</span>
        </h2>
        {description && (
          <p className="mt-3 text-foreground/80 text-base md:text-lg leading-relaxed">{description}</p>
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
      className="max-w-5xl mx-auto text-center"
    >
      <h1 className={cn('text-[2.25rem] md:text-6xl font-display font-semibold tracking-tight mb-4')}>
        <span className="heading-gradient">{intro.title}</span>
      </h1>
      <p className="text-lg md:text-xl text-primary/90 font-display">
        <span className="metallic-accent">{intro.tagline}</span>
      </p>
      <p className="mt-6 text-foreground/80 leading-relaxed">{intro.bio}</p>
    </motion.section>
  );
}

function NowFocus() {
  return (
    <Section title={now.title} description="Things I’m spending time on right now.">
      <GlassCard className="p-6 md:p-8">
        <ul className="space-y-3 list-disc list-inside text-foreground/90">
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
    <Section title="Experience" description="Selected roles and impact across engineering and content.">
      <div className="grid md:grid-cols-2 gap-6">
        {experience.map((exp) => (
          <GlassCard key={exp.role} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">{exp.role}</h3>
                <p className="text-foreground/80">{exp.company}</p>
              </div>
              <span className="text-sm text-foreground/60 whitespace-nowrap">{exp.period}</span>
            </div>
            <ul className="mt-4 space-y-2 list-disc list-inside text-foreground/90">
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
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((group) => (
          <GlassCard key={group.group} className="p-5">
            <h3 className="text-lg font-semibold text-foreground mb-3">{group.group}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm',
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
      <div className="grid md:grid-cols-3 gap-6">
        {principles.map((v) => (
          <GlassCard key={v.title} className="p-6">
            <h3 className="text-lg font-semibold text-primary">{v.title}</h3>
            <p className="mt-2 text-foreground/80 leading-relaxed">{v.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Story() {
  return (
    <Section title={story.title} description="A short, honest introduction.">
      <GlassCard className="p-6 md:p-8">
        <div className="space-y-4 text-foreground/90 leading-relaxed">
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
    <Section title="Let’s build something memorable">
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-foreground/90">Have a project or idea? I’m open to collaborations and impactful work.</p>
          <div className="flex gap-3">
            <a
              href="mailto:contact@example.com"
              className={cn('btn btn-ghost')}
            >
              Email me
            </a>
            <a
              href="/blog"
              className={cn('btn btn-primary')}
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
    <div className="space-y-16 md:space-y-24">
      <Intro />
      <NowFocus />
      <Story />
      <Experience />
      <Skills />
      <Values />
      <CallToAction />
    </div>
  );
}


