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
  { href: '/community', label: 'Community' },
];

function lagosDate(style: 'long' | 'short') {
  return new Date()
    .toLocaleDateString('en-GB', {
      timeZone: 'Africa/Lagos',
      weekday: style,
      day: 'numeric',
      month: style,
      ...(style === 'long' ? { year: 'numeric' as const } : {}),
    });
}

export default function PressTopline() {
  const pathname = usePathname() ?? '/';
  const { theme, toggleTheme, mounted } = useTheme();
  // Rendered in the browser so a statically built page always shows today's date.
  const [date, setDate] = useState<{ long: string; short: string } | null>(null);

  useEffect(() => {
    setDate({ long: lagosDate('long'), short: lagosDate('short') });
  }, []);

  return (
    <div className="press-topline">
      <span>
        Lagos
        {date ? (
          <>
            {' '}
            &middot; <time className="date-long">{date.long}</time>
            <time className="date-short">{date.short}</time>
          </>
        ) : null}
      </span>
      <div className="right">
        <nav aria-label="Main navigation">
          <ul>
            {NAV.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link href={href} aria-current={active ? 'page' : undefined}>
                    <span className="hl-swipe">{label}</span>
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
            <span className="icon-swap" data-show={theme === 'dark' ? 'a' : 'b'} aria-hidden="true">
              <Sun />
              <Moon />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
