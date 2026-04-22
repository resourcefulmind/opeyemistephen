'use client';

import { usePathname } from 'next/navigation';
import { useMobileNav } from '../../contexts/MobileNavContext';
import MobileNav from './MobileNav';

export default function BlogMobileNavButton() {
  const pathname = usePathname() ?? '';
  const { isMobileNavOpen, toggleMobileNav } = useMobileNav();

  const isBlogPage = pathname.startsWith('/blog');

  if (!isBlogPage) return null;

  return <MobileNav isOpen={isMobileNavOpen} onToggle={toggleMobileNav} />;
}
