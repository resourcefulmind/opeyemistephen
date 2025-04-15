# Blog System Documentation

## Overview

This blog system uses MDX to create rich, interactive blog posts with React components. The system includes a schema validation system, production/development mode differences, and image handling.

## Getting Started

1. Create a new `.mdx` file in `src/content/articles/`
2. Use the template at `src/content/articles/template.mdx.example` as a starting point
3. Update the frontmatter (metadata) with your post details
4. Write your content using Markdown and MDX components

## Recent Updates

- **Image Fallbacks**: Images now have automatic fallback handling if sources are invalid
- **Development Indicators**: Posts that would be hidden in production now show a "Development Only" badge
- **Toggle Filter**: Added ability to toggle between showing all posts or only production posts while in development
- **Expanded Author Support**: Author field now accepts both simple strings and detailed objects

## Frontmatter Schema

Each blog post requires the following frontmatter at the top of the file:

```yaml
---
title: "Your Post Title"
date: "2023-12-22" # YYYY-MM-DD format or ISO format with time
excerpt: "A short summary of your post"
slug: "your-post-slug" # URL-friendly identifier
tags: ["tag1", "tag2"] # Array of related topics
author: "Your Name" # Can be a string or an object
---
```

### Required Fields

- **title**: The title of your blog post
- **date**: Publication date in YYYY-MM-DD format or full ISO format
- **excerpt**: A short summary for previews and SEO
- **slug**: URL-friendly identifier (lowercase letters, numbers, hyphens)

### Optional Fields

- **tags**: Array of related topics/keywords
- **author**: String name or object with additional information:
  ```yaml
  author: {
    name: "Author Name",
    avatar: "/path/to/avatar.jpg",
    bio: "Short author biography"
  }
  ```
- **coverImage**: Path to the featured image
- **status**: Publication status ("published", "draft", "archived", "scheduled")
- **draft**: Boolean flag to mark post as draft
- **readingTime**: Estimated reading time in minutes (calculated automatically if not provided)

## Development vs. Production Mode

### Development Mode

- Shows all blog posts, including drafts and unpublished posts
- Displays "Development Only" badges on posts that wouldn't appear in production
- Provides a toggle to show/hide draft posts
- Useful for previewing content before publishing

### Production Mode

- Only shows published posts (not drafts)
- Filters out posts with status other than "published"
- No development-specific UI elements are shown

## Custom Components

The blog supports custom MDX components:

- `<Callout>`: Styled callout boxes for tips, warnings, etc.
- `<TableOfContents>`: Automatically generated table of contents
- `<CodeBlock>`: Enhanced code blocks with syntax highlighting

## Images

- Cover images are specified in the frontmatter
- In-content images use standard Markdown syntax
- All images have fallback handling if the source is invalid
- Use proper paths for images:
  - Local images should be in the public directory (e.g., `/images/blog/my-image.jpg`)
  - Or use external URLs (e.g., from Cloudinary)

## Best Practices

1. Always include all required frontmatter fields
2. Use the draft flag for posts that aren't ready for production
3. Optimize images before adding them to the blog
4. Test your posts in both development and production modes
5. Use proper heading hierarchy (H1 → H2 → H3, etc.)

## Troubleshooting

### Common Issues

- **Images not displaying**: Make sure paths are correct or use the built-in fallback system
- **Posts not appearing**: Check if the post is marked as draft or has a non-published status
- **Validation errors**: Ensure all required fields are present and formatted correctly
- **Date formatting**: Both simple dates (YYYY-MM-DD) and ISO format dates are supported 