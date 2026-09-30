import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostPreview, ValidatedPostMetadata } from '@/lib/blog/types';
import type { TocHeading } from '@/lib/blog/headings';
import ArticleProgress from './ArticleProgress';
import ArticleToc from './ArticleToc';
import PressFooter from './PressFooter';
import { formatDate, TYPE_LABEL, TYPE_PLURAL } from './format';

interface ArticleViewProps {
  slug: string;
  frontmatter: ValidatedPostMetadata;
  headings: TocHeading[];
  /** Series parts in order, when this post belongs to a series. */
  seriesParts: BlogPostPreview[];
  /** Two recent posts of the same type, for posts outside a series. */
  related: BlogPostPreview[];
  children: React.ReactNode;
}

function partNumber(slug: string) {
  const m = slug.match(/part(\d+)/i);
  return m ? Number(m[1]) : 0;
}

function authorName(author: ValidatedPostMetadata['author']) {
  if (!author) return 'Opeyemi Stephen';
  return typeof author === 'string' ? author : author.name;
}

function EndCard({ post, label }: { post: BlogPostPreview; label: string }) {
  const fm = post.frontmatter;
  return (
    <Link href={`/blog/${post.slug}`} className="end-card">
      <span className="chip">{label}</span>
      <span className="end-title">
        <span className="hl-swipe">{fm.title}</span>
      </span>
      <span className="meta">
        {formatDate(fm.date)}
        {fm.readingTime ? <> &middot; {fm.readingTime} min</> : null}
      </span>
    </Link>
  );
}

export default function ArticleView({
  slug,
  frontmatter: fm,
  headings,
  seriesParts,
  related,
  children,
}: ArticleViewProps) {
  const type = fm.type ?? 'tutorial';
  const index = seriesParts.findIndex((p) => p.slug === slug);
  const part = fm.series ? partNumber(slug) : 0;
  const prevPart = index > 0 ? seriesParts[index - 1] : null;
  const nextPart = index >= 0 && index < seriesParts.length - 1 ? seriesParts[index + 1] : null;

  return (
    <>
      <ArticleProgress />

      <article className="article">
        <header className="article-head">
          <h1>{fm.title}</h1>
          <p className="article-dek">{fm.excerpt}</p>
          <p className="article-meta">
            <span className="chip">{TYPE_LABEL[type]}</span>
            {fm.series ? (
              <span>
                {fm.series}, part {part} of {seriesParts.length}
              </span>
            ) : null}
            <span>By {authorName(fm.author)}</span>
            <time dateTime={fm.date}>{formatDate(fm.date)}</time>
            {fm.readingTime ? <span>{fm.readingTime} min read</span> : null}
          </p>
          {fm.tags.length ? (
            <p className="article-tags">
              {fm.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </p>
          ) : null}
        </header>

        {fm.coverImage ? (
          <figure className="article-cover">
            <Image
              src={fm.coverImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1180px) 100vw, 1132px"
            />
          </figure>
        ) : null}

        <div className="article-grid">
          <ArticleToc headings={headings} />
          <div className="article-body">{children}</div>
        </div>

        <footer className="article-end">
          {fm.series && (prevPart || nextPart) ? (
            <nav aria-label={`${fm.series} navigation`} className="end-row">
              {prevPart ? <EndCard post={prevPart} label={`Part ${partNumber(prevPart.slug)} · Previous`} /> : <span />}
              {nextPart ? <EndCard post={nextPart} label={`Part ${partNumber(nextPart.slug)} · Up next`} /> : null}
            </nav>
          ) : related.length ? (
            <nav aria-label={TYPE_PLURAL[type]} className="end-row">
              {related.map((p) => (
                <EndCard key={p.slug} post={p} label={TYPE_PLURAL[type]} />
              ))}
            </nav>
          ) : null}
        </footer>
      </article>

      <PressFooter to="archive" />
    </>
  );
}
