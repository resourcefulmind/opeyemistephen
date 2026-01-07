# Fix Blog Post SEO Meta Tags for Social Media Previews

## Problem

When sharing blog post links on social media platforms (Twitter, WhatsApp, Facebook), the previews were showing:
- Homepage preview image instead of article cover images
- Homepage title and description instead of article-specific content
- Generic placeholder images on some platforms

This occurred because:
1. `BlogPost.tsx` was using incomplete inline `Helmet` meta tags
2. The existing `BlogPostSEO` component existed but wasn't being used
3. Critical meta tags were missing (`og:url`, Twitter Card tags, image dimensions)
4. Image URL handling was broken (double URL concatenation for Cloudinary images)
5. Wrong default domain was set (`opeyemistephen.com` instead of `opeyemibangkok.com`)

## Solution

- **Replaced inline Helmet with BlogPostSEO component**: Now using the comprehensive SEO component that was already built but unused
- **Fixed image URL handling**: Properly detects and handles absolute Cloudinary URLs without double concatenation
- **Added missing Open Graph tags**: 
  - `og:url` (critical for proper link previews)
  - `og:image:width`, `og:image:height`, `og:image:alt`
  - `og:locale`, `og:site_name`
- **Added complete Twitter Card support**:
  - `twitter:card`, `twitter:image`, `twitter:image:alt`, `twitter:site`
- **Updated domain and branding**: Changed default `siteUrl` to `opeyemibangkok.com` and author name to "Opeyemi Stephen"

## Changes

### Modified Files
- `src/components/Blog/BlogPost.tsx`: Replaced inline Helmet with BlogPostSEO component
- `src/components/SEO/BlogPostSEO.tsx`: 
  - Fixed image URL handling for absolute URLs
  - Added missing Open Graph and Twitter Card meta tags
  - Updated default domain and author name

### New Content
- `src/content/articles/flutterwave-mono-analysis.mdx`: New article on Flutterwave-Mono acquisition

## Testing

After deployment, social media previews should now display:
- ✅ Article-specific cover images (from Cloudinary)
- ✅ Article titles and descriptions
- ✅ Correct article URLs
- ✅ Proper image dimensions for optimal display

**Note**: Social platforms cache previews. After deployment, use these tools to refresh:
- Twitter: https://cards-dev.twitter.com/validator
- Facebook: https://developers.facebook.com/tools/debug/
- WhatsApp: May take 24-48 hours or share in a new chat

## Impact

- ✅ All blog posts now have proper social media previews
- ✅ Better SEO with complete meta tags and structured data
- ✅ Improved user experience when sharing articles
- ✅ Consistent branding across all platforms

