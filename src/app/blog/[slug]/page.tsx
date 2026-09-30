import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import ArticleView from '@/components/press/ArticleView';
import PressLayout from '@/components/press/PressLayout';
import ReadMarker from '@/components/press/ReadMarker';
import { articleMdx } from '@/components/press/articleMdx';
import { extractHeadings } from '@/lib/blog/headings';
import { getAllPosts, getPostBySlug, getSeries, postType } from '@/lib/blog/loader';
import { DISPLAY_NAME, SITE_URL, bylineName, personJsonLd } from '@/content/identity';


function resolveImageUrl(coverImage?: string): string {
  if (!coverImage) return `${SITE_URL}/opengraph-image`;
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return coverImage;
  }
  return `${SITE_URL}${coverImage}`;
}

function resolveAuthorName(author: unknown): string {
  if (typeof author === 'string') return bylineName(author);
  if (author && typeof author === 'object' && 'name' in author) {
    const name = (author as { name?: unknown }).name;
    if (typeof name === 'string') return bylineName(name);
  }
  return DISPLAY_NAME;
}

export async function generateStaticParams() {
  const posts = await getAllPosts(true);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  const { frontmatter } = post;
  const {
    title,
    excerpt,
    date,
    tags = [],
    author,
    lastUpdated,
    canonicalUrl,
  } = frontmatter;

  const postUrl = `${SITE_URL}/blog/${slug}`;
  const canonical = canonicalUrl ?? postUrl;
  const authorName = resolveAuthorName(author);
  const publishedTime = new Date(date).toISOString();
  const modifiedTime = lastUpdated
    ? new Date(lastUpdated).toISOString()
    : publishedTime;

  return {
    title,
    description: excerpt,
    authors: [{ name: authorName }],
    keywords: tags,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description: excerpt,
      url: canonical,
      siteName: DISPLAY_NAME,
      locale: 'en_US',
      publishedTime,
      modifiedTime,
      authors: [authorName],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      creator: '@devvgbg',
      site: '@devvgbg',
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const series = post.frontmatter.series;
  const seriesParts = series ? getSeries(allPosts, series).parts : [];
  const type = post.frontmatter.type ?? 'tutorial';
  const related = series
    ? []
    : allPosts.filter((p) => p.slug !== slug && postType(p) === type).slice(0, 2);
  const headings = extractHeadings(post.body);

  const postUrl = `${SITE_URL}/blog/${slug}`;
  const canonical = post.frontmatter.canonicalUrl ?? postUrl;
  const imageUrl = resolveImageUrl(post.frontmatter.coverImage);
  const authorName = resolveAuthorName(post.frontmatter.author);
  const publishedTime = new Date(post.frontmatter.date).toISOString();
  const modifiedTime = post.frontmatter.lastUpdated
    ? new Date(post.frontmatter.lastUpdated).toISOString()
    : publishedTime;
  const readingTime = post.frontmatter.readingTime;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    image: imageUrl,
    author: authorName === DISPLAY_NAME ? personJsonLd : { '@type': 'Person', name: authorName },
    publisher: { '@id': `${SITE_URL}/#person`, '@type': 'Person', name: DISPLAY_NAME, url: SITE_URL },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    url: canonical,
    keywords: (post.frontmatter.tags ?? []).join(', '),
    ...(readingTime && {
      wordCount: readingTime * 200,
      timeRequired: `PT${readingTime}M`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PressLayout>
        <ReadMarker slug={slug} series={series} />
        <ArticleView
          slug={slug}
          frontmatter={post.frontmatter}
          headings={headings}
          seriesParts={seriesParts}
          related={related}
        >
          <MDXRemote
            source={post.body}
            components={articleMdx}
            options={{
              parseFrontmatter: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
              },
            }}
          />
        </ArticleView>
      </PressLayout>
    </>
  );
}
