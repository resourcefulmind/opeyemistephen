'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

function lagosDate() {
  return new Date()
    .toLocaleDateString('en-GB', {
      timeZone: 'Africa/Lagos',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();
}

export default function PressTopline() {
  const pathname = usePathname() ?? '/';
  const { theme, toggleTheme, mounted } = useTheme();
  // Rendered in the browser so a statically built page always shows today's date.
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(lagosDate());
  }, []);

  return (
    <div className="press-topline">
      <span>
        Lagos{date ? <> &middot; <time>{date}</time></> : null}
      </span>
      <div className="right">
        <nav aria-label="Main navigation">
          <ul>
            {NAV.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="hl-swipe"
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {mounted && (
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
