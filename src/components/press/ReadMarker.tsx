'use client';

import { useEffect } from 'react';
import { READ_KEY, SERIES_KEY } from './readState';

/** Records, in this browser only, that an article was opened. Renders nothing. */
export default function ReadMarker({ slug, series }: { slug: string; series?: string }) {
  useEffect(() => {
    try {
      const read: string[] = JSON.parse(localStorage.getItem(READ_KEY) ?? '[]');
      if (!read.includes(slug)) {
        localStorage.setItem(READ_KEY, JSON.stringify([...read, slug].slice(-200)));
      }
      if (series) {
        const last = JSON.parse(localStorage.getItem(SERIES_KEY) ?? '{}');
        localStorage.setItem(SERIES_KEY, JSON.stringify({ ...last, [series]: slug }));
      }
    } catch {
      /* storage unavailable: reading marks are a convenience only */
    }
  }, [slug, series]);
  return null;
}
