'use client';

import { useLayoutEffect, useRef, useState } from 'react';

const PIXELS_PER_SECOND = 45;

type Item = { text: string; href?: string };

/**
 * The "In production" strip. The moving copy is decorative (hidden from assistive
 * tech, links out of the tab order); the list under it is the accessible version,
 * with the same links reachable by keyboard.
 */
export default function NowTicker({ items, label = 'In production' }: { items: Item[]; label?: string }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.setProperty('--dur', `${track.scrollWidth / 2 / PIXELS_PER_SECOND}s`);
  }, [items]);

  const run = (dup: boolean) =>
    items.map((item, i) => (
      <span key={`${dup ? 'dup' : 'run'}-${i}`} className={dup ? 'dup' : undefined}>
        {item.href ? (
          <a href={item.href} tabIndex={-1} rel="noopener">
            {item.text}
          </a>
        ) : (
          item.text
        )}
      </span>
    ));

  return (
    <section className={`ticker${paused ? ' paused' : ''}`} aria-label={label}>
      <span className="tag" aria-hidden="true">
        {label}
      </span>
      <div className="stage" aria-hidden="true">
        <div className="track" ref={trackRef}>
          {run(false)}
          {run(true)}
        </div>
      </div>
      <ul className="sr-only-press">
        {items.map((item, i) => (
          <li key={i}>{item.href ? <a href={item.href}>{item.text}</a> : item.text}</li>
        ))}
      </ul>
      <button
        type="button"
        className="ctl"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? `Play the ${label} ticker` : `Pause the ${label} ticker`}
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
