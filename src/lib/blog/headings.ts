import GithubSlugger from 'github-slugger';

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Plain text of a markdown heading: drops links, code ticks, emphasis and inline HTML. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/\s+#+\s*$/, '')
    .trim();
}

/**
 * The article's h2 and h3 headings, with the same ids rehype-slug gives them,
 * read straight from the MDX source so the contents list renders on the server.
 * Lines inside fenced code blocks are skipped: a `# comment` in Python is not a heading.
 */
export function extractHeadings(source: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let fence: string | null = null;

  for (const line of source.split('\n')) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match) continue;

    const depth = match[1].length;
    const text = plainText(match[2]);
    if (!text) continue;

    // Every heading advances the slugger, as rehype-slug does, so duplicate ids line up.
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) headings.push({ id, text, level: depth });
  }

  return headings;
}
