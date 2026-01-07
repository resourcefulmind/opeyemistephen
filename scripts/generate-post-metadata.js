/**
 * Build-time script to generate a JSON file with all blog post metadata
 * This file is used by Vercel Edge Middleware to inject meta tags for social crawlers
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const articlesDir = join(__dirname, '../src/content/articles');
const outputFile = join(__dirname, '../public/blog-metadata.json');

// Simple frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  const frontmatterText = match[1];
  const frontmatter = {};
  
  // Parse YAML-like frontmatter
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
      }
      
      frontmatter[key] = value;
    }
  });
  
  return frontmatter;
}

async function generateMetadata() {
  try {
    const files = await readdir(articlesDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    const metadata = {};
    
    for (const file of mdxFiles) {
      const filePath = join(articlesDir, file);
      const content = await readFile(filePath, 'utf-8');
      const frontmatter = parseFrontmatter(content);
      
      if (!frontmatter) {
        console.warn(`Skipping ${file}: No frontmatter found`);
        continue;
      }
      
      // Extract slug from filename or frontmatter
      const slug = frontmatter.slug || file.replace('.mdx', '');
      
      // Skip drafts and unpublished posts
      if (frontmatter.draft === 'true' || frontmatter.status === 'draft') {
        continue;
      }
      
      metadata[slug] = {
        title: frontmatter.title || 'Untitled',
        excerpt: frontmatter.excerpt || '',
        coverImage: frontmatter.coverImage || '',
        date: frontmatter.date || '',
        author: frontmatter.author || 'Opeyemi Stephen',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
              (frontmatter.tags ? [frontmatter.tags] : []),
        readingTime: frontmatter.readingTime || 5,
      };
    }
    
    await writeFile(outputFile, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log(`✅ Generated metadata for ${Object.keys(metadata).length} posts`);
    console.log(`📄 Output: ${outputFile}`);
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    process.exit(1);
  }
}

generateMetadata();

