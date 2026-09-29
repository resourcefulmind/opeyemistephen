import FrontPage from '@/components/press/FrontPage';
import PressLayout from '@/components/press/PressLayout';
import {
  getAllPosts,
  getFrontSlots,
  getLeadPost,
  getMoreAnalysis,
} from '@/lib/blog/loader';

export default async function HomePage() {
  const posts = await getAllPosts();
  const lead = getLeadPost(posts);
  const slots = getFrontSlots(posts, lead?.slug);
  const moreAnalysis = getMoreAnalysis(posts, lead?.slug);

  return (
    <PressLayout>
      <FrontPage
        issueNumber={posts.length}
        lead={lead}
        slots={slots}
        moreAnalysis={moreAnalysis}
      />
    </PressLayout>
  );
}
