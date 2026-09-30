'use client';

import { useEffect } from 'react';

/** Marks the name correction as seen for this visit (tab session), so it plays once per visit. */
export default function NameSeen() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem('name-correction-seen', '1');
      } catch {
        /* storage unavailable: the animation simply plays again next time */
      }
    }, 1600);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
