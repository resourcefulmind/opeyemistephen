import Link from 'next/link';
import { motto } from '@/content/home.config';

export default function PressFooter({ to }: { to: 'archive' | 'home' }) {
  return (
    <footer className="press-footer">
      <span className="motto" lang="la">
        {motto}
      </span>
      {to === 'archive' ? (
        <Link href="/blog" className="cta">
          The full archive <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : (
        <Link href="/" className="cta">
          <span aria-hidden="true">&larr;</span> Front page
        </Link>
      )}
    </footer>
  );
}
