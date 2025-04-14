/**
 * Blog Schema Module
 * 
 * This module provides validation functions for blog post frontmatter.
 * It ensures that all required fields are present and properly formatted.
 */
import { 
  PostMetadata, 
  ValidatedPostMetadata, 
  RawFrontmatter, 
  FrontmatterValidationError 
} from './types';

/**
 * Validates that a string is not empty
 * 
 * @param value - The value to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns The trimmed string if valid
 * @throws {FrontmatterValidationError} If the value is not a string or is empty
 */
function validateRequiredString(value: any, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new FrontmatterValidationError(`${fieldName} is required and must be a non-empty string`, fieldName);
  }
  return value.trim();
}

/**
 * Validates a date string is in ISO format (YYYY-MM-DD)
 * 
 * @param value - The date string to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns The validated date string
 * @throws {FrontmatterValidationError} If the date format is invalid
 */
function validateDateString(value: any, fieldName: string): string {
  const date = validateRequiredString(value, fieldName);
  
  // Simple regex for YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(date)) {
    throw new FrontmatterValidationError(
      `${fieldName} must be in YYYY-MM-DD format`, 
      fieldName
    );
  }
  
  // Ensure it's a valid date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new FrontmatterValidationError(
      `${fieldName} is not a valid date`, 
      fieldName
    );
  }
  
  return date;
}

/**
 * Validates a slug string (lowercase, alphanumeric, hyphens)
 * 
 * Slugs are used in URLs and must follow specific formatting rules:
 * - Only lowercase letters
 * - Numbers
 * - Hyphens (no spaces or other special characters)
 * 
 * @param value - The slug string to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns The validated slug string
 * @throws {FrontmatterValidationError} If the slug format is invalid
 */
function validateSlug(value: any, fieldName: string): string {
  const slug = validateRequiredString(value, fieldName);
  
  // Slug format: lowercase letters, numbers, hyphens
  const slugRegex = /^[a-z0-9\-]+$/;
  
  if (!slugRegex.test(slug)) {
    throw new FrontmatterValidationError(
      `${fieldName} must contain only lowercase letters, numbers, and hyphens`, 
      fieldName
    );
  }
  
  return slug;
}

/**
 * Validates an array of tags
 * 
 * Tags are optional but if provided must be an array of non-empty strings.
 * If no tags are provided, returns an empty array as default.
 * 
 * @param value - The tags array to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns Array of validated tags or empty array if none provided
 * @throws {FrontmatterValidationError} If any tag is invalid
 */
function validateTags(value: any, fieldName: string): string[] {
  if (!Array.isArray(value)) {
    // If tags is not provided or not an array, use empty array as default
    return [];
  }
  
  // Validate each tag is a non-empty string
  return value.map((tag, index) => {
    if (typeof tag !== 'string' || tag.trim() === '') {
      throw new FrontmatterValidationError(
        `${fieldName}[${index}] must be a non-empty string`, 
        fieldName
      );
    }
    return tag.trim();
  });
}

/**
 * Validates optional string fields
 * 
 * Optional strings can be undefined/null, but if provided must be valid strings.
 * Empty strings are normalized to undefined.
 * 
 * @param value - The string value to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns The trimmed string if valid, undefined if not provided or empty
 * @throws {FrontmatterValidationError} If the value is provided but not a string
 */
function validateOptionalString(value: any, fieldName: string): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  
  if (typeof value !== 'string') {
    throw new FrontmatterValidationError(
      `${fieldName} must be a string if provided`, 
      fieldName
    );
  }
  
  return value.trim() === '' ? undefined : value.trim();
}

/**
 * Validates optional boolean fields
 * 
 * @param value - The boolean value to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns The boolean value if valid, undefined if not provided
 * @throws {FrontmatterValidationError} If the value is provided but not a boolean
 */
function validateOptionalBoolean(value: any, fieldName: string): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  
  if (typeof value !== 'boolean') {
    throw new FrontmatterValidationError(
      `${fieldName} must be a boolean if provided`, 
      fieldName
    );
  }
  
  return value;
}

/**
 * Validates optional number fields
 * 
 * @param value - The number value to validate
 * @param fieldName - The name of the field being validated (for error messages)
 * @returns The number value if valid, undefined if not provided
 * @throws {FrontmatterValidationError} If the value is provided but not a number
 */
function validateOptionalNumber(value: any, fieldName: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  
  if (typeof value !== 'number' || isNaN(value)) {
    throw new FrontmatterValidationError(
      `${fieldName} must be a number if provided`, 
      fieldName
    );
  }
  
  return value;
}

/**
 * Validates frontmatter against the schema
 * 
 * This is the main validation function that processes all fields in the frontmatter.
 * It checks both required and optional fields according to their specific validation rules.
 * 
 * @param raw - Raw frontmatter data from MDX file
 * @returns Validated frontmatter conforming to the schema
 * @throws {FrontmatterValidationError} If any validation fails
 */
export function validateFrontmatter(raw: RawFrontmatter): ValidatedPostMetadata {
  try {
    // Validate required fields
    const title = validateRequiredString(raw.title, 'title');
    const date = validateDateString(raw.date, 'date');
    const excerpt = validateRequiredString(raw.excerpt, 'excerpt');
    const slug = validateSlug(raw.slug, 'slug');
    
    // Validate optional fields
    const tags = validateTags(raw.tags, 'tags');
    const author = validateOptionalString(raw.author, 'author');
    const coverImage = validateOptionalString(raw.coverImage, 'coverImage');
    const canonicalUrl = validateOptionalString(raw.canonicalUrl, 'canonicalUrl');
    const featured = validateOptionalBoolean(raw.featured, 'featured');
    const readingTime = validateOptionalNumber(raw.readingTime, 'readingTime');
    const lastUpdated = raw.lastUpdated 
      ? validateDateString(raw.lastUpdated, 'lastUpdated') 
      : undefined;
    const draft = validateOptionalBoolean(raw.draft, 'draft');
    
    // Construct validated frontmatter
    return {
      title,
      date,
      excerpt,
      slug,
      tags,
      ...(author && { author }),
      ...(coverImage && { coverImage }),
      ...(canonicalUrl && { canonicalUrl }),
      ...(featured !== undefined && { featured }),
      ...(readingTime !== undefined && { readingTime }),
      ...(lastUpdated && { lastUpdated }),
      ...(draft !== undefined && { draft }),
    } as ValidatedPostMetadata;
  } catch (error) {
    if (error instanceof FrontmatterValidationError) {
      throw error;
    }
    throw new FrontmatterValidationError(`Frontmatter validation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Calculates estimated reading time based on word count
 * 
 * Uses a standard reading speed of 200 words per minute.
 * Returns a minimum of 1 minute even for very short content.
 * 
 * @param content - Post content as string
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
} 