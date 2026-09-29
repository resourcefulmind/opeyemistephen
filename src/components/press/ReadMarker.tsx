'use client';

import { useEffect } from 'react';
import { PROGRESS_KEY, SERIES_KEY } from './readState';

/**
 * Records, in this browser only, how far through an article the reader got and
 * which series part they opened last. Renders nothing.
 */
export default function ReadMarker({ slug, series }: { slug: string; series?: string }) {
  useEffect(() => {
    try {
      if (series) {
        const last = JSON.parse(localStorage.getItem(SERIES_KEY) ?? '{}');
        localStorage.setItem(SERIES_KEY, JSON.stringify({ ...last, [series]: slug }));
      }
    } catch {
      /* storage unavailable: reading marks are a convenience only */
    }

    let best = 0;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const body = document.querySelector<HTMLElement>('.blog-content');
      if (!body) return;
      const rect = body.getBoundingClientRect();
      // Share of the article body that has passed the bottom of the viewport.
      const seen = (window.innerHeight - rect.top) / rect.height;
      const pct = Math.max(0, Math.min(100, Math.round(seen * 100)));
      if (pct <= best) return;
      best = pct;
      try {
        const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}');
        if ((progress[slug] ?? 0) < pct) {
          localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...progress, [slug]: pct }));
        }
      } catch {
        /* storage unavailable */
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [slug, series]);

  return null;
}
