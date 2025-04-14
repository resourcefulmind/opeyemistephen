# Blog System Developer Documentation

This document provides a technical overview of the blog system architecture, designed for developers maintaining or extending the codebase.

## Architecture Overview

The blog system is built on the following technologies:
- **React** - UI framework
- **TypeScript** - Type safety
- **MDX** - Markdown + JSX for content
- **Vite** - Build tool with HMR

### Key Directories

```
src/
├── components/
│   ├── Blog/               # Blog-specific components
│   │   ├── BlogList.tsx    # List of blog posts
│   │   ├── BlogPost.tsx    # Individual post view
│   │   └── ...
│   └── MDXComponents.tsx   # MDX component customizations
├── content/
│   ├── articles/           # MDX blog post files
│   └── README.md           # Instructions for content creators
├── lib/
│   └── blog/               # Blog core functionality
│       ├── loader.ts       # Post loading & caching
│       ├── schema.ts       # Frontmatter validation
│       └── types.ts        # TypeScript definitions
└── types/
    └── mdx.d.ts            # MDX TypeScript declarations
```

## Core Components

### Blog Post Loading

The `loader.ts` module contains two main functions:

1. `getAllPosts()` - Loads all blog posts for listings
   - Uses Vite's `import.meta.glob` for dynamic imports
   - Validates frontmatter against schema
   - Caches results for performance
   - Filters by draft status & publication status in production

2. `getPostBySlug(slug)` - Loads a specific blog post by slug
   - Dynamically imports a single MDX file
   - Validates its frontmatter
   - Checks publication status for production

### TypeScript Type System

The `types.ts` file defines the core data structures:

- `PostMetadata` - Structure of blog post frontmatter
- `BlogPost` - Complete post with content and metadata
- `BlogPostPreview` - Lightweight post preview for listings
- `Author` - Detailed author information structure

### Frontmatter Validation

The `schema.ts` module:
- Defines validation functions for each field type
- Validates frontmatter against the schema
- Provides detailed error messages for invalid data
- Supports default values and auto-calculated fields (e.g., reading time)

## MDX Processing Pipeline

1. Vite's MDX plugin processes `.mdx` files
2. Remark plugins parse frontmatter and transform Markdown
3. Rehype plugins handle HTML transformation (syntax highlighting, etc.)
4. Result is compiled into a React component with exported frontmatter

### Plugin Chain

The Vite config includes:
- `remark-frontmatter` - Parses YAML frontmatter
- `remark-mdx-frontmatter` - Exports frontmatter as a JS object
- `remark-gfm` - GitHub Flavored Markdown (tables, etc.)
- `rehype-highlight` - Code syntax highlighting
- `rehype-slug` - Auto-generates heading IDs for linking

## Custom Components

The `MDXComponents.tsx` file:
- Defines customized versions of standard HTML elements
- Adds custom components like `Callout` and `TableOfContents`
- Wraps everything in the MDX provider

## Adding New Features

### Adding a New Custom Component

1. Define the component in `MDXComponents.tsx`
2. Add it to the `components` object
3. Document its usage in the content guide

Example:
```tsx
// 1. Define component
const NewComponent = (props) => {
  return <div className="my-component">{props.children}</div>;
};

// 2. Add to components object
const components = {
  // ... existing components
  NewComponent,
};
```

### Adding a New Frontmatter Field

1. Add the field to the `PostMetadata` interface in `types.ts`
2. Add validation in `schema.ts`
3. Update the documentation in `content/README.md`

Example:
```ts
// In types.ts
export interface PostMetadata {
  // ... existing fields
  /** My new field description */
  newField?: string;
}

// In schema.ts
// Inside validateFrontmatter function:
const newField = validateOptionalString(raw.newField, 'newField');

// Add to returned object:
return {
  // ... existing fields
  ...(newField && { newField }),
};
```

## Common Issues & Troubleshooting

### Missing Content

If posts aren't appearing:
- Check production/development environment filtering
- Verify frontmatter validation isn't failing
- Check console for error messages

### Performance Issues

The blog uses several performance optimizations:
- Post caching to avoid reprocessing
- Sorted lists to avoid resorting
- Dynamic imports to load only what's needed

If performance degrades:
- Check if cache invalidation is working correctly
- Look for unnecessary re-renders in React components
- Verify dynamic imports are working as expected

## Testing and Validation

When extending the blog system:
1. Test with valid and invalid frontmatter
2. Verify error messages are clear for content creators
3. Ensure production filtering works correctly
4. Test with various MDX content features

## Future Improvements

Potential enhancements to consider:
- Pagination for large blog collections
- Category/tag filtering systems
- Related posts based on tags or content
- Search functionality
- Scheduled publishing using the 'scheduled' status
- Analytics integration for post views 