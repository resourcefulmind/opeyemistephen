'use client';

import { useEffect, useState } from 'react';
import { articleBody, bodyProgress } from './readState';

/** Thin bar at the top of the article showing how much of the text has been reached. */
export default function ArticleProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const body = articleBody();
      if (body) setPct(bodyProgress(body));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    // Images and code blocks settle after first paint and change the body's height.
    const settle = window.setTimeout(update, 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="article-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <span style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
