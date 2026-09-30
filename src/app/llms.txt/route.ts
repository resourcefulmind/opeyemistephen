import { getAllPosts, postType } from '@/lib/blog/loader';
import { DISPLAY_NAME, LEGAL_NAME, PROFILES, SITE_URL, seo } from '@/content/identity';

export const dynamic = 'force-static';

const SECTION: Record<string, string> = {
  analysis: 'Analysis',
  'case-study': 'Case studies',
  explainer: 'Explainers',
  tutorial: 'Tutorials',
  note: 'Notes',
};

/** A plain-text map of the site for AI tools (llmstxt.org format). */
export async function GET() {
  const posts = await getAllPosts(true);
  const lines: string[] = [
    `# ${DISPLAY_NAME}`,
    '',
    `> ${seo.homeDescription}`,
    '',
    `${DISPLAY_NAME} is the name ${LEGAL_NAME} writes and builds under; both names refer to the same person. Based in Lagos. Open to developer relations and developer experience roles, remote or relocating.`,
    '',
    '## About',
    '',
    `- [About ${DISPLAY_NAME}](${SITE_URL}/about): the record, principles and contact`,
    ...PROFILES.map((url) => `- [${new URL(url).hostname.replace('www.', '')}](${url})`),
  ];
  for (const [type, label] of Object.entries(SECTION)) {
    const items = posts.filter((p) => postType(p) === type);
    if (!items.length) continue;
    lines.push('', `## ${label}`, '');
    for (const p of items) {
      lines.push(`- [${p.frontmatter.title}](${SITE_URL}/blog/${p.slug}): ${p.frontmatter.excerpt}`);
    }
  }
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
