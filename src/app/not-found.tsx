import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Page not found</h2>
        <p className="mb-4">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-primary/30 hover:bg-primary/50 transition-colors rounded"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
