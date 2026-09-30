import Link from 'next/link';
import type { BlogPostPreview } from '@/lib/blog/types';
import PressFooter from './PressFooter';
import StruckPath from './StruckPath';
import { formatDate, TYPE_LABEL } from './format';

export default function NotFoundPage({ latest }: { latest: BlogPostPreview[] }) {
  return (
    <>
      <header className="masthead notfound-head">
        <StruckPath />
        <h1>This page didn&rsquo;t make the edition</h1>
      </header>

      <aside className="correction" aria-label="Correction">
        <p className="correction-label">Correction</p>
        <p>
          A link sent you to a page that doesn&rsquo;t exist, or no longer does. We regret the error.
        </p>
        <div className="correction-actions">
          <Link href="/" className="cta">
            Front page <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link href="/blog">
            <span className="hl-swipe">Browse the blog</span>
          </Link>
        </div>
      </aside>

      {latest.length ? (
        <section className="meanwhile" aria-labelledby="meanwhile-heading">
          <h2 id="meanwhile-heading">Meanwhile, in this edition</h2>
          <div className="end-row end-row-3">
            {latest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="end-card">
                <span className="chip">{TYPE_LABEL[post.frontmatter.type ?? 'tutorial']}</span>
                <span className="end-title">
                  <span className="hl-swipe">{post.frontmatter.title}</span>
                </span>
                <span className="meta">
                  {formatDate(post.frontmatter.date)}
                  {post.frontmatter.readingTime ? <> &middot; {post.frontmatter.readingTime} min</> : null}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <PressFooter to="archive" />
    </>
  );
}
