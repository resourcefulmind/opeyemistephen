/**
 * Script to generate a JSON file with all blog post metadata
 * This runs at build time and creates a static JSON file that the
 * Vercel Edge Function can use to serve dynamic OG meta tags
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_DIR = path.join(__dirname, '../src/content/articles');
const OUTPUT_FILE = path.join(__dirname, '../public/posts-meta.json');

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return null;

  const frontmatterStr = match[1];
  const frontmatter = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterStr.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value.replace(/'/g, '"'));
      } catch {
        // Keep as string if parsing fails
      }
    }

    // Parse booleans
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    frontmatter[key] = value;
  }

  return frontmatter;
}

function generatePostsMeta() {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'));
  const posts = {};

  for (const file of files) {
    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) continue;

    // Skip drafts in production
    if (frontmatter.draft === true) continue;
    if (frontmatter.status && frontmatter.status !== 'published') continue;

    const slug = frontmatter.slug || file.replace('.mdx', '');

    posts[slug] = {
      title: frontmatter.title || 'Untitled',
      excerpt: frontmatter.excerpt || '',
      coverImage: frontmatter.coverImage || null,
      date: frontmatter.date || '',
      author: frontmatter.author || 'Opeyemi Stephen',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      readingTime: frontmatter.readingTime || 5
    };
  }

  // Ensure public directory exists
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Generated posts metadata: ${Object.keys(posts).length} posts`);
}

generatePostsMeta();
