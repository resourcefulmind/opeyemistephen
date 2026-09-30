import FrontPage from '@/components/press/FrontPage';
import PressLayout from '@/components/press/PressLayout';
import { DISPLAY_NAME, LEGAL_NAME, SITE_URL, personJsonLd, seo } from '@/content/identity';
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: SITE_URL,
                name: DISPLAY_NAME,
                alternateName: LEGAL_NAME,
                description: seo.homeDescription,
                publisher: { '@id': `${SITE_URL}/#person` },
                inLanguage: 'en',
              },
              personJsonLd,
            ],
          }),
        }}
      />
      <FrontPage
        issueNumber={posts.length}
        lead={lead}
        slots={slots}
        moreAnalysis={moreAnalysis}
      />
    </PressLayout>
  );
}
