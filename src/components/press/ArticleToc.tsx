'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/lib/blog/headings';

/**
 * Contents list. On wide screens it sits beside the text and marks the section
 * being read; on phones it folds into a "Contents" disclosure above the text.
 */
export default function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const list = (
    <ol>
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? 'sub' : undefined}>
          <a href={`#${h.id}`} aria-current={active === h.id ? 'location' : undefined}>
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <details className="toc-mobile">
        <summary>Contents</summary>
        {list}
      </details>
      <nav className="toc-side" aria-label="Contents">
        <p className="toc-heading">Contents</p>
        {list}
      </nav>
    </>
  );
}
