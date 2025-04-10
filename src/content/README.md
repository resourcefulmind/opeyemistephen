# Blog Content Guidelines

This document explains how to create and format blog posts for our MDX-powered blog.

## File Structure

All blog posts should be placed in the `src/content/articles` directory as `.mdx` files.

## Frontmatter

Every blog post must include frontmatter at the top of the file. Frontmatter is metadata enclosed in triple dashes `---`.

### Required Fields

| Field   | Description | Example |
|---------|-------------|---------|
| `title` | The title of your post | `"Building a React App with TypeScript"` |
| `date`  | Publication date in YYYY-MM-DD format | `"2023-04-07"` |
| `excerpt` | A brief summary (1-2 sentences) | `"Learn how to set up a React project with TypeScript."` |
| `slug` | URL-friendly identifier (auto-generated from filename if omitted) | `"react-typescript-setup"` |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `tags` | Array of related keywords | `["react", "typescript", "tutorial"]` |
| `author` | The writer's name (defaults to site author) | `"Jane Doe"` |
| `coverImage` | Path to an image for the post | `"/images/blog/react-ts.jpg"` |
| `canonicalUrl` | Original URL if posted elsewhere first | `"https://example.com/original-post"` |
| `featured` | Whether post should be featured prominently | `true` |
| `readingTime` | Estimated minutes to read (auto-calculated if omitted) | `5` |
| `lastUpdated` | Date when post was last updated | `"2023-05-10"` |
| `draft` | Set to true for work-in-progress posts | `true` |

## Example Frontmatter

```mdx
---
title: "Getting Started with React and TypeScript"
date: "2023-04-07"
excerpt: "Set up a new React project with TypeScript and understand the basics."
tags: ["react", "typescript", "beginners"]
author: "Jane Doe"
coverImage: "/images/blog/react-typescript.jpg" 
featured: true
draft: false
---

# Content starts here...
```

## Content Guidelines

- Use Markdown syntax for content
- Use headings (`#`, `##`, `###`) to organize your content
- Include code examples with triple backticks and language identifier:
  ````
  ```typescript
  const greeting = (name: string): string => {
    return `Hello, ${name}!`;
  };
  ```
  ````
- Images can be included using standard Markdown: `![Alt text](/path/to/image.jpg)`
- You can use React components inside your MDX content

## Validation

Our build system validates your frontmatter against the schema. If there are issues, you'll see error messages during development or the build process.

### Common Validation Errors

- Missing required fields
- Date in wrong format (use YYYY-MM-DD)
- Invalid slug format (use only lowercase letters, numbers, and hyphens)

## Draft Posts

Posts marked as `draft: true` will be visible during development but won't be published in production.

This makes it easy to work on posts without exposing them to readers until they're ready. 