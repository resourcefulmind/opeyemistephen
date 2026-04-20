'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import ConditionalHeader from '@/components/ConditionalHeader';
import Navbar from '@/components/Navbar';
import BlogMobileNavButton from '@/components/Blog/BlogMobileNavButton';
import { ThemeToggle } from '@/components/ThemeToggle';

const TwinklingBackground = dynamic(
  () => import('@/components/Hero').then((mod) => mod.TwinklingBackground),
  { ssr: false }
);

const ShootingStars = dynamic(
  () => import('@/components/Hero').then((mod) => mod.ShootingStars),
  { ssr: false }
);

const MeteorShower = dynamic(() => import('@/components/MeteroShower'), {
  ssr: false,
});

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <ConditionalHeader>
        <Navbar />
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <BlogMobileNavButton />
          <ThemeToggle />
        </div>
      </ConditionalHeader>

      {isHomePage ? (
        children
      ) : (
        <div className="min-h-screen bg-background">
          <div className="fixed inset-0 -z-10 bg-background">
            <TwinklingBackground />
            <ShootingStars />
            <MeteorShower />
            <div className="nebula nebula-left" />
            <div className="nebula nebula-right" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_100%)] animate-float dark:opacity-100 light:opacity-30" />
          </div>
          <div className="pt-24 px-6 relative z-10">{children}</div>
        </div>
      )}
    </>
  );
}
