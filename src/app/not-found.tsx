import NotFoundPage from '@/components/press/NotFoundPage';
import PressLayout from '@/components/press/PressLayout';
import { getAllPosts, postType } from '@/lib/blog/loader';

export default async function NotFound() {
  const posts = await getAllPosts();
  const latest = posts.filter((p) => postType(p) !== 'note').slice(0, 3);
  return (
    <PressLayout>
      <NotFoundPage latest={latest} />
    </PressLayout>
  );
}
