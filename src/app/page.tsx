import { Hero } from '@/components/Hero';
import HomeContent from '@/components/HomeContent';
import { getAllPosts, getPopularPosts } from '@/lib/blog/loader';

export default async function HomePage() {
  const posts = await getAllPosts();
  const featuredPosts = getPopularPosts(posts, 3);

  return (
    <>
      <Hero />
      <HomeContent featuredPosts={featuredPosts} />
    </>
  );
}
