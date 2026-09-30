/**
 * Copy for the Press front page and archive. Approved as "Copy A" in the
 * 2026-09-29 redesign session. Edit freely; nothing else reads these strings.
 */

export const masthead = {
  role:
    'I ship software, write the courses and guides that teach developers to build, and read the receipts before the press release.',
  edition: 'Lagos edition',
  topics: [
    { label: 'Web3', topic: 'web3' },
    { label: 'Fintech', topic: 'fintech' },
    { label: 'Developer education', topic: 'education' },
  ],
};

export const contactEmail = 'omodaraopeyemi754@gmail.com';

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/resourcefulmind' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/opeyemistephen/' },
  { label: 'X', href: 'https://x.com/devvgbg' },
  { label: 'Email', href: `mailto:${contactEmail}` },
];

/** The "In production" ticker: named projects, each true for a season. Keep it current. */
export const inProduction: Array<{ text: string; href?: string }> = [
  {
    text: 'Kronos: wallet and transaction components for Solana\u2019s framework-kit',
    href: 'https://github.com/Kronos-Guild/framework-kit',
  },
  {
    text: 'arch-angel: persistent architectural memory for engineering teams',
    href: 'https://github.com/resourcefulmind/arch-angel',
  },
  { text: 'swarm-trader: a Solana trading harness built to be trusted with real money' },
  { text: 'Writing: case studies on shipping developer platforms' },
];

export const archiveIntro =
  'Analysis, case studies, explainers and tutorials, newest first in each section.';

export const seriesBlurb =
  'Ten parts on how Solana works, from Proof of History to tokenomics, written for engineers who know REST but not Solana. Start at Part 1.';

export const openTo = 'Currently open to developer relations and developer experience roles, remote or relocating.';

export const contactLine =
  'Hiring for developer relations, or building something that needs teaching? My inbox is open.';

export const motto = 'Sic Parvis Magna';
