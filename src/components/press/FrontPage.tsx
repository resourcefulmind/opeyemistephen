import Image from 'next/image';
import Link from 'next/link';
import type { BlogPostPreview } from '@/lib/blog/types';
import type { FrontSlot } from '@/lib/blog/loader';
import { principles } from '@/content/about.config';
import { now, seriesBlurb } from '@/content/home.config';
import Masthead from './Masthead';
import NowTicker from './NowTicker';
import PressFooter from './PressFooter';
import { formatDate, TYPE_LABEL } from './format';

interface FrontPageProps {
  issueNumber: number;
  lead?: BlogPostPreview;
  slots: FrontSlot[];
  moreAnalysis: BlogPostPreview[];
}

function SideStory({ slot }: { slot: FrontSlot }) {
  if (slot.series) {
    const first = slot.series.parts[0];
    return (
      <article>
        {first?.frontmatter.coverImage && (
          <Link href={`/blog/${first.slug}`} className="thumb" tabIndex={-1} aria-hidden="true">
            <Image src={first.frontmatter.coverImage} alt="" fill loading="eager" sizes="(max-width: 820px) 100vw, 380px" />
          </Link>
        )}
        <h3>
          <Link href={`/blog/${first?.slug ?? ''}`}>
            <span className="hl-swipe">Solana Whitepaper Breakdown</span>
          </Link>
        </h3>
        <p>{seriesBlurb}</p>
        <div className="meta">
          <span className="chip">{TYPE_LABEL.explainer}</span> &middot; {slot.series.parts.length} parts
          &middot; {slot.series.totalMinutes} min in total
        </div>
      </article>
    );
  }

  const { post } = slot;
  const fm = post.frontmatter;
  return (
    <article>
      {fm.coverImage && (
        <Link href={`/blog/${post.slug}`} className="thumb" tabIndex={-1} aria-hidden="true">
          <Image src={fm.coverImage} alt="" fill loading="eager" sizes="(max-width: 820px) 100vw, 380px" />
        </Link>
      )}
      <h3>
        <Link href={`/blog/${post.slug}`}>
          <span className="hl-swipe">{fm.title}</span>
        </Link>
      </h3>
      <p>{fm.excerpt}</p>
      <div className="meta">
        <span className="chip">{TYPE_LABEL[slot.kind]}</span> &middot;{' '}
        <time dateTime={fm.date}>{formatDate(fm.date)}</time>
        {fm.readingTime ? <> &middot; {fm.readingTime} min</> : null}
      </div>
    </article>
  );
}

export default function FrontPage({ issueNumber, lead, slots, moreAnalysis }: FrontPageProps) {
  return (
    <>
      <Masthead issueNumber={issueNumber} />
      <NowTicker items={now} />

      <section className="front" aria-label="Latest writing">
        {lead && (
          <article className="lead">
            <span className="stamp" aria-hidden="true">
              Latest
            </span>
            {lead.frontmatter.coverImage && (
              <Link href={`/blog/${lead.slug}`} className="shot" tabIndex={-1} aria-hidden="true">
                <Image
                  src={lead.frontmatter.coverImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 820px) 100vw, 740px"
                />
              </Link>
            )}
            <h2>
              <Link href={`/blog/${lead.slug}`}>
                <span className="hl-swipe">{lead.frontmatter.title}</span>
              </Link>
            </h2>
            <p className="dek">{lead.frontmatter.excerpt}</p>
            <div className="meta">
              <span className="chip">{TYPE_LABEL[lead.frontmatter.type ?? 'analysis']}</span> &middot;{' '}
              <time dateTime={lead.frontmatter.date}>{formatDate(lead.frontmatter.date)}</time>
              {lead.frontmatter.readingTime ? <> &middot; {lead.frontmatter.readingTime} min read</> : null}
            </div>

            {moreAnalysis.length > 0 && (
              <nav className="more" aria-labelledby="more-analysis">
                <h3 id="more-analysis">More analysis</h3>
                {moreAnalysis.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <span className="hl-swipe">{post.frontmatter.title}</span>
                    <span className="when">
                      {formatDate(post.frontmatter.date)}
                      {post.frontmatter.readingTime ? <> &middot; {post.frontmatter.readingTime} min</> : null}
                    </span>
                  </Link>
                ))}
              </nav>
            )}
          </article>
        )}

        <div className="side">
          {slots.map((slot) => (
            <SideStory key={slot.kind} slot={slot} />
          ))}
        </div>
      </section>

      <section className="principles" aria-labelledby="principles-heading">
        <h2 id="principles-heading">Principles</h2>
        <ol>
          {principles.slice(0, 4).map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong>
              <span>{p.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      <PressFooter to="archive" />
    </>
  );
}
