'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PROGRESS_KEY, READ_THRESHOLD, SERIES_KEY, articleBody, bodyProgress } from './readState';

/** Below this, there is nothing worth resuming. */
const RESUME_MIN = 5;

/** Scroll position at which `pct` percent of the article body has passed the bottom of the viewport. */
function scrollTargetFor(pct: number) {
  const body = articleBody();
  if (!body) return null;
  const rect = body.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  return Math.max(0, top + (pct / 100) * rect.height - window.innerHeight);
}

/**
 * Records, in this browser only, how far through an article the reader got and
 * which series part they opened last. When the reader comes back to an article
 * they left partway, it offers to take them back to where they stopped, or does
 * so directly when they arrive from the archive's "You stopped here" link.
 */
export default function ReadMarker({ slug, series }: { slug: string; series?: string }) {
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const bestRef = useRef(0);

  const resume = useCallback((pct: number) => {
    const y = scrollTargetFor(pct);
    if (y === null) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    setResumeAt(null);
  }, []);

  // Offer (or perform) the resume, using the progress stored before this visit.
  useEffect(() => {
    let stored = 0;
    try {
      stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}')[slug] ?? 0;
    } catch {
      /* storage unavailable */
    }
    if (stored < RESUME_MIN || stored >= READ_THRESHOLD) return;

    const url = new URL(window.location.href);
    if (url.searchParams.get('resume') === '1') {
      url.searchParams.delete('resume');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
      // Give images and code blocks a moment to take their final height.
      const t = window.setTimeout(() => resume(stored), 350);
      return () => window.clearTimeout(t);
    }
    setResumeAt(stored);
  }, [slug, resume]);

  // Record progress while reading.
  useEffect(() => {
    try {
      if (series) {
        const last = JSON.parse(localStorage.getItem(SERIES_KEY) ?? '{}');
        localStorage.setItem(SERIES_KEY, JSON.stringify({ ...last, [series]: slug }));
      }
    } catch {
      /* storage unavailable: reading marks are a convenience only */
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const body = articleBody();
      if (!body) return;
      const pct = bodyProgress(body);
      if (pct <= bestRef.current) return;
      bestRef.current = pct;
      // Once the reader is back past where they stopped, the offer has done its job.
      setResumeAt((at) => (at !== null && pct >= at ? null : at));
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

  if (resumeAt === null) return null;

  return (
    <div className="resume-pill" role="region" aria-label="Continue reading">
      <button type="button" className="go" onClick={() => resume(resumeAt)}>
        Continue where you left off <span className="pct">{resumeAt}%</span>
      </button>
      <button
        type="button"
        className="close"
        onClick={() => setResumeAt(null)}
        aria-label="Dismiss continue reading"
      >
        <svg viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
