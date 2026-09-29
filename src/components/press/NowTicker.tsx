'use client';

import { useLayoutEffect, useRef, useState } from 'react';

const PIXELS_PER_SECOND = 45;

export default function NowTicker({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Constant reading speed no matter how long the items are.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    track.style.setProperty('--dur', `${half / PIXELS_PER_SECOND}s`);
  }, [items]);

  const run = items.map((item, i) => <span key={i}>{item}</span>);

  return (
    <section className={`ticker${paused ? ' paused' : ''}`} aria-label="Now">
      <span className="tag" aria-hidden="true">
        NOW
      </span>
      <div className="stage" aria-hidden="true">
        <div className="track" ref={trackRef}>
          {run}
          {items.map((item, i) => (
            <span key={`dup-${i}`}>{item}</span>
          ))}
        </div>
      </div>
      <ul className="sr-only-press">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <button
        type="button"
        className="ctl"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play the Now ticker' : 'Pause the Now ticker'}
        aria-pressed={paused}
      >
        {paused ? (
          <svg viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 1.5v11l9-5.5z" />
          </svg>
        ) : (
          <svg viewBox="0 0 14 14" aria-hidden="true">
            <rect x="2" y="1" width="3.5" height="12" rx="1" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
          </svg>
        )}
      </button>
    </section>
  );
}
