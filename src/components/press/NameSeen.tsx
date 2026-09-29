'use client';

import { useEffect } from 'react';

/** Marks the name correction as seen so it only plays on a visitor's first visit. */
export default function NameSeen() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem('name-correction-seen', '1');
      } catch {
        /* storage unavailable: the animation simply plays again next time */
      }
    }, 1600);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
