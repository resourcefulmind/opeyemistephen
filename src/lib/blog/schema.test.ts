import { validateFrontmatter, calculateReadingTime } from './schema';
import { FrontmatterValidationError } from './types';

// This is a simple test file to manually verify our schema validation
// In a real application, you would use a testing framework like Jest

console.log('Testing frontmatter validation...');

// Test valid frontmatter
try {
  const validFrontmatter = validateFrontmatter({
    title: 'Valid Test Post',
    date: '2023-04-07',
    excerpt: 'This is a valid test post',
    slug: 'valid-test-post',
    tags: ['test', 'validation'],
  });
  console.log('✅ Valid frontmatter passed:', validFrontmatter);
} catch (error) {
  console.error('❌ Valid frontmatter failed:', error);
}

// Test missing required field
try {
  const invalidFrontmatter = validateFrontmatter({
    // Missing title
    date: '2023-04-07',
    excerpt: 'This is an invalid test post',
    slug: 'invalid-test-post',
  });
  console.error('❌ Invalid frontmatter (missing title) passed when it should fail');
} catch (error) {
  if (error instanceof FrontmatterValidationError) {
    console.log('✅ Correctly caught missing title:', error.message);
  } else {
    console.error('❌ Wrong error type for missing title:', error);
  }
}

// Test invalid date format
try {
  const invalidDateFrontmatter = validateFrontmatter({
    title: 'Invalid Date Post',
    date: '04/07/2023', // Wrong format
    excerpt: 'This post has an invalid date format',
    slug: 'invalid-date-post',
  });
  console.error('❌ Invalid date format passed when it should fail');
} catch (error) {
  if (error instanceof FrontmatterValidationError) {
    console.log('✅ Correctly caught invalid date format:', error.message);
  } else {
    console.error('❌ Wrong error type for invalid date:', error);
  }
}

// Test invalid slug
try {
  const invalidSlugFrontmatter = validateFrontmatter({
    title: 'Invalid Slug Post',
    date: '2023-04-07',
    excerpt: 'This post has an invalid slug',
    slug: 'Invalid Slug With Spaces!', // Invalid slug
  });
  console.error('❌ Invalid slug passed when it should fail');
} catch (error) {
  if (error instanceof FrontmatterValidationError) {
    console.log('✅ Correctly caught invalid slug:', error.message);
  } else {
    console.error('❌ Wrong error type for invalid slug:', error);
  }
}

// Test optional fields
try {
  const withOptionalFields = validateFrontmatter({
    title: 'Optional Fields Post',
    date: '2023-04-07',
    excerpt: 'This post has optional fields',
    slug: 'optional-fields-post',
    author: 'Test Author',
    coverImage: '/images/test.jpg',
    featured: true,
    draft: false,
  });
  console.log('✅ Optional fields passed:', withOptionalFields);
} catch (error) {
  console.error('❌ Optional fields failed:', error);
}

// Test reading time calculation
const shortText = 'This is a short text with only a few words.';
const longText = 'Lorem ipsum '.repeat(500); // About 500 words

console.log('Reading time for short text:', calculateReadingTime(shortText), 'minutes');
console.log('Reading time for long text:', calculateReadingTime(longText), 'minutes');

console.log('Validation tests complete!');

// To run this test file:
// 1. Uncomment the next line to export a function that can be called
// 2. Import and call this function from another file
// export const runTests = () => console.log('Tests executed'); 