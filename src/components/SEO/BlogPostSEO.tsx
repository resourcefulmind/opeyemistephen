import { Helmet } from 'react-helmet';
import { BlogPost } from '../../lib/blog/types';

interface BlogPostSEOProps {
  post: BlogPost;
  siteUrl?: string;
}

export default function BlogPostSEO({ post, siteUrl = 'https://opeyemistephen.com' }: BlogPostSEOProps) {
  const {
    frontmatter: { title, excerpt, date, tags, coverImage, author, readingTime },
    slug: postSlug
  } = post;

  const postUrl = `${siteUrl}/blog/${postSlug}`;
  const imageUrl = coverImage ? `${siteUrl}${coverImage}` : `${siteUrl}/images/blog/default-cover.jpg`;
  const authorName = typeof author === 'string' ? author : author?.name || 'Stephen Opeyemi';
  const publishedDate = new Date(date).toISOString();
  const modifiedDate = new Date().toISOString(); // You can add lastUpdated to frontmatter

  // Generate structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": excerpt,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stephen Opeyemi",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "url": postUrl,
    "keywords": tags?.join(', ') || '',
    "wordCount": readingTime ? readingTime * 200 : undefined,
    "timeRequired": readingTime ? `PT${readingTime}M` : undefined
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | Stephen Opeyemi's Blog</title>
      <meta name="description" content={excerpt} />
      <meta name="keywords" content={tags?.join(', ') || ''} />
      <meta name="author" content={authorName} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={excerpt} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:site_name" content="Stephen Opeyemi's Blog" />
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={authorName} />
      {tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={excerpt} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@devvgbg" />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={postUrl} />
      
      {/* Reading Time */}
      {readingTime && (
        <meta name="reading-time" content={`${readingTime} minutes`} />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
}
