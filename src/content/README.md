# Blog Content

This directory contains MDX blog posts for the portfolio website.

## Directory Structure
- `articles/` - MDX blog post files
- `articles/template.mdx.example` - Template for creating new posts

## Documentation
For complete information on creating and managing blog posts, please see:
- [Blog System Documentation](../../docs/blog-system.md)

## Structure

- `articles/`: Contains all blog posts as MDX files
  - Each file should follow the naming pattern: `my-post-title.mdx`

## Usage

See the [Blog System Documentation](../../docs/blog-system.md) for detailed information on creating blog posts and the frontmatter schema.

## Sample Post

```mdx
---
title: "My Sample Post"
date: "2023-12-22"
excerpt: "This is a sample post showing the basic structure"
slug: "sample-post"
tags: ["sample", "example"]
author: "Your Name"
---

# My Sample Post

This is the content of my post written in Markdown and MDX.

## A Section

Content for this section...

<Callout type="info">
  This is a custom MDX component.
</Callout>
``` 