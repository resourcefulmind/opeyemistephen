import { Suspense } from 'react';
import type { Metadata } from 'next';
import Archive from '@/components/press/Archive';
import PressFooter from '@/components/press/PressFooter';
import PressLayout from '@/components/press/PressLayout';
import { getAllPosts } from '@/lib/blog/loader';
import { seo } from '@/content/identity';

export const metadata: Metadata = {
  title: 'Blog',
  description: seo.blogDescription,
  alternates: { canonical: 'https://www.opeyemibangkok.com/blog' },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <PressLayout>
      <Suspense fallback={<p className="empty">Loading the archive&hellip;</p>}>
        <Archive posts={posts} />
      </Suspense>
      <PressFooter to="home" />
    </PressLayout>
  );
}
