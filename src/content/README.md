# Blog Content Creator's Guide

This comprehensive guide explains how to create and format blog posts for our MDX-powered blog system. It covers basic formatting, component usage, and best practices.

## Table of Contents

- [File Structure and Setup](#file-structure-and-setup)
- [Frontmatter Requirements](#frontmatter-requirements)
- [Markdown Basics](#markdown-basics)
- [MDX Components](#mdx-components)
- [Code Block Usage](#code-block-usage)
- [Images and Media](#images-and-media)
- [Tables](#tables)
- [Advanced Formatting](#advanced-formatting)
- [Publishing Workflow](#publishing-workflow)
- [Troubleshooting](#troubleshooting)

## File Structure and Setup

All blog posts should be placed in the `src/content/articles` directory as `.mdx` files. The filename will be used as the post slug by default, so use URL-friendly names:

```
src/
└── content/
    └── articles/
        ├── hello-world.mdx
        ├── getting-started-with-react.mdx
        └── advanced-typescript-patterns.mdx
```

## Frontmatter Requirements

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
| `author` | The writer's name or object | `"Jane Doe"` or see [detailed format](#detailed-author-format) |
| `coverImage` | Path to an image for the post | `"/images/blog/react-ts.jpg"` |
| `canonicalUrl` | Original URL if posted elsewhere first | `"https://example.com/original-post"` |
| `featured` | Whether post should be featured prominently | `true` |
| `readingTime` | Estimated minutes to read (auto-calculated if omitted) | `5` |
| `lastUpdated` | Date when post was last updated | `"2023-05-10"` |
| `status` | Publication status | `"published"` (default), `"draft"`, `"archived"` |
| `draft` | Set to true for work-in-progress posts | `true` |

### Detailed Author Format

For advanced author information, you can use an object structure:

```mdx
---
author: {
  name: "Jane Doe",
  avatar: "/images/avatars/jane.jpg",
  bio: "Senior Frontend Developer at Example Corp",
  url: "https://janedoe.com",
  social: {
    twitter: "@janedoe",
    github: "janedoe",
    linkedin: "jane-doe"
  }
}
---
```

### Example Frontmatter

```mdx
---
title: "Getting Started with React and TypeScript"
date: "2023-04-07"
excerpt: "Set up a new React project with TypeScript and understand the basics."
slug: "react-typescript-setup"
tags: ["react", "typescript", "beginners"]
author: "Jane Doe"
coverImage: "/images/blog/react-typescript.jpg" 
featured: true
status: "published"
---

# Content starts here...
```

## Markdown Basics

Our blog uses standard Markdown syntax with GitHub Flavored Markdown extensions:

### Headings

```markdown
# Heading 1 - Main title (usually only one per post)
## Heading 2 - Major sections
### Heading 3 - Subsections
#### Heading 4 - Minor sections
```

### Text Formatting

```markdown
This is **bold text** and this is *italic text*.
This is also __bold text__ and this is also _italic text_.

This is ~~strikethrough text~~.

This is a [link to our website](https://example.com).
```

### Lists

```markdown
Unordered list:
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

Ordered list:
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> > And can be nested.
```

## MDX Components

Our blog supports several custom components that you can use in your MDX files:

### Callout Boxes

Use callouts to highlight important information:

```mdx
<Callout type="info" title="Note">
  This is an information callout for general notes.
</Callout>

<Callout type="tip">
  This is a tip callout for helpful advice.
</Callout>

<Callout type="warning">
  This is a warning callout for potential issues.
</Callout>

<Callout type="error" title="Critical Error">
  This is an error callout for critical information.
</Callout>
```

Available types: `info`, `tip`, `warning`, `error`

### Table of Contents

Automatically generate a table of contents from your headings:

```mdx
<TableOfContents />
```

## Code Block Usage

Code blocks are styled with syntax highlighting and include a copy button. Specify the language after the opening backticks:

````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

```css
.container {
  display: flex;
  flex-direction: column;
}
```

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
````

Supported languages include: `javascript`, `typescript`, `jsx`, `tsx`, `css`, `scss`, `html`, `bash`, `json`, `yaml`, `markdown`, and many more.

### Inline Code

For inline code, use single backticks: `const example = 'this is inline code';`

## Images and Media

### Basic Images

```markdown
![Alt text for the image](/path/to/image.jpg)
```

### Images with Captions

```markdown
![React Logo](/images/react-logo.png "React JavaScript Library Logo")
```

## Tables

Tables use the GitHub Flavored Markdown syntax:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

The table above would render as:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

For alignment, you can use colons in the separator line:

```markdown
| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|---------------:|
| Left         | Center         | Right          |
```

## Advanced Formatting

### Math Equations

You can include mathematical expressions using LaTeX syntax:

For inline math, use single dollar signs: `$E = mc^2$`

For block equations, use double dollar signs wrapped in backticks:

```markdown
`$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi) e^{2\pi i \xi x} d\xi
$$`
```

### Embedded Components in Tables

You can use MDX components within table cells:

```markdown
| Feature | Example | Description |
|---------|---------|-------------|
| Callouts | <Callout type="tip">Tip in table</Callout> | A callout in a table cell |
```

## Publishing Workflow

### Draft Mode

To work on a post without publishing it, set `draft: true` in the frontmatter. Draft posts are:
- Visible during development
- Hidden in production

### Post Status

Use the `status` field to control publication:
- `"published"`: Visible to everyone (default if not specified)
- `"draft"`: Same as `draft: true`, hidden in production
- `"archived"`: Not listed but still accessible via direct URL
- `"scheduled"`: For future implementation of scheduled publishing

## Troubleshooting

### Common Issues

1. **Post not showing up**: 
   - Check that `draft` is not set to `true`
   - Ensure `status` is either not set or set to `"published"`
   - Verify the date is not in the future

2. **Validation errors**:
   - Ensure all required fields are present
   - Check date format (must be YYYY-MM-DD)
   - Verify slug format (lowercase, hyphens, no spaces or special characters)

3. **Component not rendering**:
   - Make sure the component name is correctly capitalized
   - Check that the component is being imported or is globally available

### Getting Help

If you encounter issues not covered in this guide, please contact the development team or open an issue in the repository.

---

Happy blogging! 