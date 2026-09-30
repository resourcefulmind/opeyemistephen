'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import PressLayout from '@/components/press/PressLayout';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught by error.tsx:', error);
  }, [error]);

  return (
    <PressLayout>
      <header className="masthead notfound-head">
        <h1>Stop the presses</h1>
      </header>
      <aside className="correction" role="alert">
        <p className="correction-label">Printing error</p>
        <p>Something went wrong while this page was being set. Try it again; if it keeps happening, the front page still works.</p>
        {error.digest ? <p className="correction-ref">Reference: {error.digest}</p> : null}
        <div className="correction-actions">
          <button type="button" onClick={reset} className="cta">
            Try again
          </button>
          <Link href="/">
            <span className="hl-swipe">Front page</span>
          </Link>
        </div>
      </aside>
    </PressLayout>
  );
}
