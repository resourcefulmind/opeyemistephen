'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const currentPath = usePathname() ?? '';

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <Link
      href={to}
      className="relative group py-2 px-2 sm:py-3 sm:px-3 outline-none focus-visible:outline-none"
      onClick={(e) => {
        if (isActive(to)) {
          e.currentTarget.blur();
        }
      }}
    >
      <div
        className={cn(
          'absolute inset-0 bg-primary/5 backdrop-blur-md rounded-lg border border-primary/10 transition-all duration-300 -z-10',
          isActive(to)
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100 group-focus:opacity-100'
        )}
      ></div>
      <span
        className={cn(
          'text-foreground group-hover:text-primary group-focus:text-primary transition-colors duration-300 font-medium text-sm',
          isActive(to) && 'text-primary'
        )}
      >
        {children}
      </span>
    </Link>
  );
};

const Navbar = () => {
  return (
    <nav
      className="py-4 sm:py-6 flex-shrink min-w-0"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="flex items-center gap-1 sm:gap-2">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/blog">Blog</NavLink>
        </li>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
