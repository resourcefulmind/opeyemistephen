import { Suspense } from 'react';
import type { Metadata } from 'next';
import Archive from '@/components/press/Archive';
import PressFooter from '@/components/press/PressFooter';
import PressLayout from '@/components/press/PressLayout';
import { getAllPosts } from '@/lib/blog/loader';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Analysis, case studies, explainers and tutorials on Web3 infrastructure, African fintech, React and technical writing.',
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
