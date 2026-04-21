import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import BlogPostClient from '@/components/Blog/BlogPostClient';
import { mdxComponents } from '@/components/mdx/mdxComponents';
import {
  getAllPosts,
  getPostBySlug,
  getTagStats,
  getPopularPosts,
} from '@/lib/blog/loader';

const SITE_URL = 'https://www.opeyemibangkok.com';

function resolveImageUrl(coverImage?: string): string {
  if (!coverImage) return `${SITE_URL}/preview.png`;
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return coverImage;
  }
  return `${SITE_URL}${coverImage}`;
}

function resolveAuthorName(author: unknown): string {
  if (typeof author === 'string') return author;
  if (author && typeof author === 'object' && 'name' in author) {
    const name = (author as { name?: unknown }).name;
    if (typeof name === 'string') return name;
  }
  return 'Opeyemi Stephen';
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
  const { title, excerpt, date, tags = [], coverImage, author, lastUpdated } =
    frontmatter;

  const postUrl = `${SITE_URL}/blog/${slug}`;
  const imageUrl = resolveImageUrl(coverImage);
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
    alternates: { canonical: postUrl },
    openGraph: {
      type: 'article',
      title,
      description: excerpt,
      url: postUrl,
      siteName: 'Opeyemi Stephen',
      locale: 'en_US',
      publishedTime,
      modifiedTime,
      authors: [authorName],
      tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: [imageUrl],
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

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  const postUrl = `${SITE_URL}/blog/${slug}`;
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
    author: {
      '@type': 'Person',
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Opeyemi Stephen',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/preview.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
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
      <BlogPostClient
        frontmatter={post.frontmatter}
        slug={slug}
        prev={prev}
        next={next}
        tagStats={getTagStats(allPosts)}
        popularPosts={getPopularPosts(allPosts, 6)}
        recentPosts={allPosts.slice(0, 6)}
      >
        <MDXRemote
          source={post.body}
          components={mdxComponents}
          options={{
            parseFrontmatter: false,
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeHighlight],
            },
          }}
        />
      </BlogPostClient>
    </>
  );
}
