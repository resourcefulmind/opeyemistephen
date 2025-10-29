#!/usr/bin/env node

/**
 * Notion to MDX Migration Script
 * 
 * This script helps convert Notion exports to MDX format
 * Run with: node scripts/notion-to-mdx.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ARTICLES_DIR = './src/content/articles';
const NOTION_EXPORTS_DIR = './notion-exports';

/**
 * Convert Notion markdown to MDX format
 */
function convertNotionToMDX(notionContent, metadata) {
  // Clean up Notion-specific formatting
  let mdxContent = notionContent
    // Remove Notion's internal links
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '[$1]')
    // Fix image paths
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      // Convert to your image directory structure
      const imageName = path.basename(src);
      return `![${alt}](/images/blog/${imageName})`;
    })
    // Fix code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `\`\`\`${lang || ''}\n${code.trim()}\n\`\`\``;
    });

  // Generate frontmatter
  const frontmatter = generateFrontmatter(metadata);
  
  return `${frontmatter}\n\n${mdxContent}`;
}

/**
 * Generate frontmatter from metadata
 */
function generateFrontmatter(metadata) {
  const {
    title,
    date = new Date().toISOString().split('T')[0],
    excerpt,
    tags = [],
    author = "Stephen Opeyemi",
    slug,
    featured = false,
    draft = false
  } = metadata;

  return `---
title: "${title}"
date: ${date}
excerpt: "${excerpt || 'No excerpt provided'}"
slug: ${slug}
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
author: "${author}"
featured: ${featured}
draft: ${draft}
status: "${draft ? 'draft' : 'published'}"
---`;
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Main conversion function
 */
function convertFile(inputPath, outputPath, metadata) {
  try {
    const notionContent = fs.readFileSync(inputPath, 'utf8');
    const mdxContent = convertNotionToMDX(notionContent, metadata);
    
    fs.writeFileSync(outputPath, mdxContent);
    console.log(`✅ Converted: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

/**
 * Batch convert all files in a directory
 */
function batchConvert() {
  if (!fs.existsSync(NOTION_EXPORTS_DIR)) {
    console.log(`📁 Creating ${NOTION_EXPORTS_DIR} directory...`);
    fs.mkdirSync(NOTION_EXPORTS_DIR, { recursive: true });
    console.log(`📝 Please place your Notion markdown exports in ${NOTION_EXPORTS_DIR}`);
    return;
  }

  const files = fs.readdirSync(NOTION_EXPORTS_DIR);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  if (markdownFiles.length === 0) {
    console.log(`📝 No markdown files found in ${NOTION_EXPORTS_DIR}`);
    return;
  }

  console.log(`🔄 Converting ${markdownFiles.length} files...`);

  markdownFiles.forEach(file => {
    const inputPath = path.join(NOTION_EXPORTS_DIR, file);
    const title = file.replace('.md', '').replace(/-/g, ' ');
    const slug = generateSlug(title);
    const outputPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
    
    const metadata = {
      title,
      slug,
      excerpt: `Excerpt for ${title}`,
      tags: ['migrated-from-notion']
    };

    convertFile(inputPath, outputPath, metadata);
  });

  console.log(`🎉 Conversion complete! Check ${ARTICLES_DIR} for your MDX files.`);
}

// Run the script
if (require.main === module) {
  batchConvert();
}

module.exports = { convertNotionToMDX, generateSlug, generateFrontmatter };
