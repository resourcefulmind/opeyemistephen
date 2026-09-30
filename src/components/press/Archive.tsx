'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { BlogPostPreview, PostType } from '@/lib/blog/types';
import { archiveIntro } from '@/content/home.config';
import { isRead, loadReadState, type ReadState } from './readState';
import { formatDate } from './format';

const TOPICS: Array<{ id: string; label: string; match: RegExp }> = [
  { id: 'all', label: 'All', match: /.*/ },
  { id: 'web3', label: 'Web3', match: /web3|blockchain|ethereum|layer 2|solana|nft|stablecoin/i },
  { id: 'solana', label: 'Solana', match: /solana/i },
  { id: 'fintech', label: 'Fintech', match: /fintech|payments|stablecoin|banking|africa/i },
  { id: 'education', label: 'Developer education', match: /education|community|writing|documentation/i },
  { id: 'react', label: 'React', match: /react|javascript|html/i },
  { id: 'ai', label: 'AI', match: /llm|agent/i },
];

const SECTIONS: Array<{ type: PostType; label: string }> = [
  { type: 'analysis', label: 'Analysis' },
  { type: 'case-study', label: 'Case studies' },
  { type: 'explainer', label: 'Explainers' },
  { type: 'tutorial', label: 'Tutorials' },
  { type: 'note', label: 'Notes' },
];

function partNumber(slug: string) {
  const m = slug.match(/part(\d+)/i);
  return m ? Number(m[1]) : 0;
}

export default function Archive({ posts }: { posts: BlogPostPreview[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const topicId = TOPICS.some((t) => t.id === params.get('topic')) ? params.get('topic')! : 'all';
  const topic = TOPICS.find((t) => t.id === topicId)!;
  // Older links (the article page menu, search results) filter by a single tag: /blog?tag=React
  const tagParam = params.get('tag')?.trim() || null;
  const tagLabel = tagParam
    ? posts.flatMap((p) => p.frontmatter.tags).find((t) => t.toLowerCase() === tagParam.toLowerCase()) ?? tagParam
    : null;

  const [reading, setReading] = useState<ReadState>({ progress: {}, seriesLast: {} });
  useEffect(() => {
    setReading(loadReadState());
  }, []);

  /**
   * Where each series flag goes: the last part opened, if it was left unfinished
   * ("You stopped here"), otherwise the part after it ("Up next").
   */
  const seriesFlags = useMemo(() => {
    const flags: Record<string, { slug: string; label: string }> = {};
    for (const [name, lastSlug] of Object.entries(reading.seriesLast)) {
      const parts = posts
        .filter((p) => p.frontmatter.series === name)
        .sort((a, b) => partNumber(a.slug) - partNumber(b.slug));
      const idx = parts.findIndex((p) => p.slug === lastSlug);
      if (idx === -1) continue;
      if (!isRead(reading, lastSlug)) {
        const pct = reading.progress[lastSlug] ?? 0;
        flags[name] = { slug: lastSlug, label: pct > 0 ? `You stopped here \u00b7 ${pct}%` : 'You stopped here' };
      } else if (parts[idx + 1]) {
        flags[name] = { slug: parts[idx + 1].slug, label: 'Up next' };
      }
    }
    return flags;
  }, [posts, reading]);

  const visible = useMemo(() => {
    if (tagParam) {
      const wanted = tagParam.toLowerCase();
      return posts.filter((p) => p.frontmatter.tags.some((tag) => tag.toLowerCase() === wanted));
    }
    return topicId === 'all'
      ? posts
      : posts.filter((p) => p.frontmatter.tags.some((tag) => topic.match.test(tag)));
  }, [posts, topic, topicId, tagParam]);

  const seriesNames = useMemo(
    () => Array.from(new Set(visible.map((p) => p.frontmatter.series).filter(Boolean))) as string[],
    [visible]
  );

  function setTopic(id: string) {
    const next = new URLSearchParams(params.toString());
    next.delete('tag');
    if (id === 'all') next.delete('topic');
    else next.set('topic', id);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function Row({ post }: { post: BlogPostPreview }) {
    const fm = post.frontmatter;
    const done = isRead(reading, post.slug);
    const pct = reading.progress[post.slug] ?? 0;
    const part = fm.series ? partNumber(post.slug) : 0;
    const title = part ? fm.title.replace(/^.*?Part \d+:\s*/i, '') : fm.title;
    const flag = fm.series && seriesFlags[fm.series]?.slug === post.slug ? seriesFlags[fm.series].label : null;
    return (
      <article className={`row${done ? ' read' : ''}`}>
        <div>
          <h3>
            <Link href={flag?.startsWith('You stopped here') ? `/blog/${post.slug}?resume=1` : `/blog/${post.slug}`}>
              {part ? <span className="part">Part {part}</span> : null}
              <span className="hl-swipe">{title}</span>
            </Link>
            {flag && <span className="chip flag">{flag}</span>}
          </h3>
          <p>{fm.excerpt}</p>
        </div>
        <div className="when">
          <time dateTime={fm.date}>{formatDate(fm.date)}</time>
          {fm.readingTime ? <span className="rt">{fm.readingTime} min</span> : null}
          {done ? (
            <span className="mark">&#10003; Read</span>
          ) : pct >= 5 ? (
            <span className="mark">{pct}% read</span>
          ) : null}
        </div>
      </article>
    );
  }

  const sections = SECTIONS.flatMap(({ type, label }) => {
    const items = visible.filter((p) => (p.frontmatter.type ?? 'tutorial') === type && !p.frontmatter.series);
    const groups: Array<{ key: string; heading: string; count: string; posts: BlogPostPreview[] }> = [];
    if (type === 'explainer') {
      for (const name of seriesNames) {
        const parts = visible
          .filter((p) => p.frontmatter.series === name)
          .sort((a, b) => partNumber(a.slug) - partNumber(b.slug));
        const done = parts.filter((p) => isRead(reading, p.slug)).length;
        groups.push({
          key: `series-${name}`,
          heading: name,
          count: done ? `${done} of ${parts.length} read` : `${parts.length} parts`,
          posts: parts,
        });
      }
    }
    if (items.length) groups.push({ key: type, heading: label, count: String(items.length), posts: items });
    return groups;
  });

  return (
    <>
      <header className="archive-head">
        <h1>The archive</h1>
        <p>{archiveIntro}</p>
        <div className="topics" role="group" aria-label="Filter by topic">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={!tagParam && t.id === topicId}
              onClick={() => setTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tagLabel && (
          <p className="tagged">
            Tagged <span className="chip">{tagLabel}</span>{' '}
            <button type="button" onClick={() => setTopic('all')}>
              Clear
            </button>
          </p>
        )}
      </header>

      <p className="sr-only-press" aria-live="polite">
        {visible.length === posts.length
          ? `Showing all ${posts.length} articles`
          : `Showing ${visible.length} of ${posts.length} articles`}
      </p>

      {sections.length === 0 ? (
        <p className="empty">
          Nothing under {tagLabel ?? topic.label} yet.{' '}
          <button type="button" onClick={() => setTopic('all')}>
            Show everything
          </button>
        </p>
      ) : (
        sections.map((s) => (
          <section key={s.key} className="section" aria-labelledby={`h-${s.key}`}>
            <h2 id={`h-${s.key}`}>
              {s.heading}
              <span className="chip">{s.count}</span>
            </h2>
            {s.posts.map((post) => (
              <Row key={post.slug} post={post} />
            ))}
          </section>
        ))
      )}
    </>
  );
}
