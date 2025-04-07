// This file is for testing MDX imports
import TestPost, { frontmatter } from '../content/articles/test-post.mdx';

// If you can see this log when importing this file, MDX is working!
console.log('MDX post title:', frontmatter?.title);
console.log('MDX component:', typeof TestPost);

// Export for usage
export { TestPost, frontmatter as TestPostFrontmatter }; 