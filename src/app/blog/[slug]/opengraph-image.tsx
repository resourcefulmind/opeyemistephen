import { ImageResponse } from 'next/og';
import { getAllPosts, getPostBySlug } from '@/lib/blog/loader';
import { ArticleCard } from '../../_og/cards';
import { OG, ogFonts } from '../../_og/fonts';
import { formatDate, TYPE_LABEL } from '@/components/press/format';

export const alt = 'Article from Opeyemi Bangkok';
export const size = OG.size;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = await getAllPosts(true);
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const fm = post?.frontmatter;
  return new ImageResponse(
    fm ? (
      <ArticleCard
        title={fm.title}
        excerpt={fm.excerpt}
        kind={TYPE_LABEL[fm.type ?? 'tutorial']}
        date={formatDate(fm.date)}
        minutes={fm.readingTime}
      />
    ) : (
      <ArticleCard title="Opeyemi Bangkok" excerpt="" kind="Blog" date="" />
    ),
    { ...size, fonts: await ogFonts() }
  );
}
