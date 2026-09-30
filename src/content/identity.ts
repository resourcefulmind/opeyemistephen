/**
 * Who the site is about, in one place. The rule, settled 2026-09-30:
 * "Opeyemi Bangkok" is the name every reader sees; "Opeyemi Stephen" (the legal
 * name) appears only in the homepage and About search titles and descriptions,
 * and in structured data as an alternate name, so a search for either finds the
 * same person.
 */
export const SITE_URL = 'https://www.opeyemibangkok.com';
export const DISPLAY_NAME = 'Opeyemi Bangkok';
export const LEGAL_NAME = 'Opeyemi Stephen';

export const PROFILES = [
  'https://github.com/resourcefulmind',
  'https://www.linkedin.com/in/opeyemistephen/',
  'https://x.com/devvgbg',
];

export const seo = {
  homeTitle: 'Opeyemi Bangkok (Opeyemi Stephen): Web3, fintech, education',
  homeDescription:
    'Opeyemi Bangkok, also known as Opeyemi Stephen, writes analysis of Web3 and African fintech, and courses and guides that teach developers to build.',
  aboutTitle: 'About Opeyemi Bangkok (Opeyemi Stephen)',
  aboutDescription:
    'Opeyemi Bangkok, also known as Opeyemi Stephen: software engineer, technical writer and educator. Open to developer relations and developer experience roles.',
  blogDescription:
    'Every piece Opeyemi Bangkok has published: analysis of Web3 and African fintech, a ten-part Solana whitepaper series, and React tutorials.',
};

/** Structured data for the person the site is about (schema.org Person). */
export const personJsonLd = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: DISPLAY_NAME,
  alternateName: LEGAL_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/images/about/opeyemi-portrait.jpg`,
  jobTitle: 'Software engineer and technical writer',
  description:
    'Writes operator-grade analysis of Web3 infrastructure and African fintech, and courses and guides that teach developers to build.',
  knowsAbout: [
    'Web3 infrastructure',
    'Solana',
    'African fintech',
    'Stablecoins',
    'Developer education',
    'Developer relations',
    'Technical writing',
    'React',
  ],
  homeLocation: { '@type': 'Place', name: 'Lagos, Nigeria' },
  sameAs: PROFILES,
};

/** Articles are credited to the display name, whatever name the frontmatter carries. */
export function bylineName(author?: string | { name: string }): string {
  const name = typeof author === 'string' ? author : author?.name;
  if (!name || name === LEGAL_NAME) return DISPLAY_NAME;
  return name;
}
