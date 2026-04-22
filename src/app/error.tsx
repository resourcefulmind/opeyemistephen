'use client';

import { useEffect } from 'react';

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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-4">
          The application encountered an unexpected error.
        </p>
        <p className="text-sm text-gray-400">
          Error: {error.message || 'Unknown error'}
        </p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-primary/30 hover:bg-primary/50 transition-colors rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
