'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { BlogPostPreview, PostType } from '@/lib/blog/types';
import { archiveIntro } from '@/content/home.config';
import { loadReadState } from './readState';
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

  const [read, setRead] = useState<Set<string>>(new Set());
  const [seriesLast, setSeriesLast] = useState<Record<string, string>>({});
  useEffect(() => {
    const state = loadReadState();
    setRead(state.read);
    setSeriesLast(state.seriesLast);
  }, []);

  const visible = useMemo(
    () =>
      topicId === 'all'
        ? posts
        : posts.filter((p) => p.frontmatter.tags.some((tag) => topic.match.test(tag))),
    [posts, topic, topicId]
  );

  const seriesNames = useMemo(
    () => Array.from(new Set(visible.map((p) => p.frontmatter.series).filter(Boolean))) as string[],
    [visible]
  );

  function setTopic(id: string) {
    const next = new URLSearchParams(params.toString());
    if (id === 'all') next.delete('topic');
    else next.set('topic', id);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function Row({ post }: { post: BlogPostPreview }) {
    const fm = post.frontmatter;
    const isRead = read.has(post.slug);
    const part = fm.series ? partNumber(post.slug) : 0;
    const title = part ? fm.title.replace(/^.*?Part \d+:\s*/i, '') : fm.title;
    const stoppedHere = fm.series && seriesLast[fm.series] === post.slug;
    return (
      <article className={`row${isRead ? ' read' : ''}`}>
        <div>
          <h3>
            <Link href={`/blog/${post.slug}`}>
              {part ? <span className="part">Part {part}</span> : null}
              <span className="hl-swipe">{title}</span>
            </Link>
            {stoppedHere && <span className="chip flag">You stopped here</span>}
          </h3>
          <p>{fm.excerpt}</p>
        </div>
        <div className="when">
          <time dateTime={fm.date}>{formatDate(fm.date)}</time>
          {fm.readingTime ? <><br />{fm.readingTime} min</> : null}
          {isRead && (
            <>
              <br />
              <span className="mark">&#10003; Read</span>
            </>
          )}
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
        const done = parts.filter((p) => read.has(p.slug)).length;
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
            <button key={t.id} type="button" aria-pressed={t.id === topicId} onClick={() => setTopic(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {sections.length === 0 ? (
        <p className="empty">
          Nothing under {topic.label} yet.{' '}
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
