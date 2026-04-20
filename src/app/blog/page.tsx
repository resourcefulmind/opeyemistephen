import { Suspense } from 'react';
import type { Metadata } from 'next';
import BlogListClient from '@/components/Blog/BlogListClient';
import {
  getAllPosts,
  getTagStats,
  getPopularPosts,
} from '@/lib/blog/loader';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles and tutorials on blockchain, web3, React, JavaScript, infrastructure, and technical writing.',
  alternates: { canonical: 'https://www.opeyemibangkok.com/blog' },
};

function BlogListFallback() {
  return (
    <div className="blog-container">
      <div className="max-w-6xl mx-auto pt-8 text-center text-foreground/70">
        Loading posts...
      </div>
    </div>
  );
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tagStats = getTagStats(posts);
  const popularPosts = getPopularPosts(posts, 6);

  return (
    <Suspense fallback={<BlogListFallback />}>
      <BlogListClient
        posts={posts}
        tagStats={tagStats}
        popularPosts={popularPosts}
      />
    </Suspense>
  );
}
