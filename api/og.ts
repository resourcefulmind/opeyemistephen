/**
 * Vercel Edge Function to serve dynamic OG meta tags for social media crawlers
 * This intercepts requests from bots and returns proper HTML with meta tags
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE_URL = 'https://www.opeyemibangkok.com';
const DEFAULT_IMAGE = `${SITE_URL}/preview.png`;
const DEFAULT_TITLE = 'Opeyemi Stephen - Software Engineer & Technical Writer';
const DEFAULT_DESCRIPTION = 'Building the future of web3 and developer education. Explore my technical articles and projects.';

interface PostMeta {
  title: string;
  excerpt: string;
  coverImage: string | null;
  date: string;
  author: string;
  tags: string[];
  readingTime: number;
}

interface PostsData {
  [slug: string]: PostMeta;
}

// Social media crawler user agents
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Pinterest',
  'Discordbot',
  'Googlebot',
  'bingbot',
  'Applebot',
];

function isCrawler(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  return CRAWLER_USER_AGENTS.some(bot =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

function generateHTML(meta: {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  tags?: string[];
}): string {
  const {
    title,
    description,
    image,
    url,
    type = 'article',
    author = 'Opeyemi Stephen',
    publishedTime,
    tags = []
  } = meta;

  const tagsMetaTags = tags.map(tag =>
    `<meta property="article:tag" content="${escapeHtml(tag)}" />`
  ).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Basic Meta Tags -->
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="author" content="${escapeHtml(author)}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(title)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:site_name" content="Opeyemi Stephen" />
  <meta property="og:locale" content="en_US" />
  ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
  <meta property="article:author" content="${escapeHtml(author)}" />
  ${tagsMetaTags}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
  <meta name="twitter:creator" content="@devvgbg" />
  <meta name="twitter:site" content="@devvgbg" />

  <!-- Canonical URL -->
  <link rel="canonical" href="${escapeHtml(url)}" />

  <!-- Redirect non-crawlers to the actual page -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(url)}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userAgent = req.headers['user-agent'];
  const path = req.query.path as string || '';

  // If not a crawler, redirect to the actual page
  if (!isCrawler(userAgent)) {
    const redirectUrl = `${SITE_URL}/${path}`;
    return res.redirect(302, redirectUrl);
  }

  // Check if this is a blog post request
  const blogMatch = path.match(/^blog\/([^\/]+)$/);

  if (blogMatch) {
    const slug = blogMatch[1];

    try {
      // Fetch the posts metadata
      const postsResponse = await fetch(`${SITE_URL}/posts-meta.json`);

      if (postsResponse.ok) {
        const posts: PostsData = await postsResponse.json();
        const post = posts[slug];

        if (post) {
          const postUrl = `${SITE_URL}/blog/${slug}`;
          const imageUrl = post.coverImage || DEFAULT_IMAGE;

          const html = generateHTML({
            title: `${post.title} | Opeyemi Stephen`,
            description: post.excerpt,
            image: imageUrl,
            url: postUrl,
            type: 'article',
            author: post.author,
            publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
            tags: post.tags
          });

          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
          return res.status(200).send(html);
        }
      }
    } catch (error) {
      console.error('Error fetching post metadata:', error);
    }
  }

  // Default: return homepage meta tags
  const html = generateHTML({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    url: `${SITE_URL}/${path}`,
    type: 'website'
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}
