export const intro = {
  title: 'About Opeyemi Bangkok',
  tagline: 'A trusted voice, a cool head, and an undaunted initiative in messy situations.',
  bio:
    'I\u2019m a software engineer and technical writer who builds developer education and ships the software it teaches. I try to keep things simple, functional, readable, and fast, because the best work is the kind people actually use.',
};

/**
 * Roles grouped into the three lanes named in the story (software, technical
 * education, ecosystem growth). Several ran at the same time, so the page shows
 * them by lane rather than as one timeline. `current` marks roles still running.
 */
export type Lane = 'software' | 'education' | 'ecosystems';

export const lanes: Array<{ id: Lane; label: string }> = [
  { id: 'software', label: 'Software' },
  { id: 'education', label: 'Technical education' },
  { id: 'ecosystems', label: 'Ecosystem growth' },
];

export const experience: Array<{
  role: string;
  company: string;
  period: string;
  lane: Lane;
  current?: boolean;
  bullets: string[];
}> = [
  {
    role: 'QA and Releases Manager',
    company: 'Solana Foundation (Solana Developer Platform)',
    period: '2026',
    lane: 'software',
    current: true,
    bullets: [
      'The human gate between a fast-moving, AI-assisted codebase and production: every release read change by change, every migration checked against its rollback, and production verified by behaviour, not by tag.',
      'Gated more than twenty production releases and stopped release-blocking defects before they reached users.',
      'Built the Coinbase on-ramp integration end to end, from embedded orders to a reusable buyer token that lets a returning buyer skip verification, and hardened the MoneyGram flow with tests and production checks.',
      'Reviewed whole features and modules end to end, including Workflow Builder, the largest change shipped in my time there, testing each claim against the code rather than the description.',
    ],
  },
  {
    role: 'Education Architect, Solana',
    company: 'Solana Foundation',
    period: '2025',
    lane: 'education',
    bullets: [
      'Designing the education arm for onboarding and maturing Solana builders.',
      'Creating developer-ready curriculum and structured learning paths.',
      'Bridging concept → protocol → shipped products for real ecosystems.',
    ],
  },
  {
    role: 'Co-Lead — Builder Community',
    company: 'Solana Students Africa',
    period: '2025',
    lane: 'ecosystems',
    bullets: [
      'Leading student engineers from “project” to “product” readiness.',
      'Running accelerators, reviews, and curriculum-aligned initiatives.',
    ],
  },
  {
    role: 'Co-Founder / Curriculum & Product',
    company: 'Kronos',
    period: '2025',
    lane: 'education',
    bullets: [
      'Building self-paced and bootcamp learning infra for Web3 builders.',
      'Converting hard protocol topics into structured, real-use education.',
    ],
  },
  {
    role: 'Co-Founder / Product',
    company: 'Daneizo',
    period: '2024',
    lane: 'software',
    bullets: [
      'Building SME lending infrastructure to unlock capital access.',
      'Designing underwriting logic and product go-to-market.',
    ],
  },
  {
    role: 'TCM & Ecosystem Builder',
    company: 'Fuel',
    period: '2024',
    lane: 'ecosystems',
    bullets: [
      'Shaped community-led education and content for builder activation.',
      'Supported awareness and technical on-ramp initiatives.',
    ],
  },
  {
    role: 'TCM, Ecosystems Builder & Documentations',
    company: 'Hyperbolic',
    period: '2024',
    lane: 'ecosystems',
    bullets: [
      'Helped build community and ecosystem readiness.',
      'Produced technical documentation and onboarding content.',
    ],
  },
  {
    role: 'Curriculum Architect',
    company: 'Chainlink',
    period: '2024',
    lane: 'education',
    bullets: [
      'Designed track to move Web2 engineers to Web3 solutions architects.',
      'Built structured learning paths with real-world protocol alignment.',
    ],
  },
  {
    role: 'Technical Community Manager & Technical Writer',
    company: 'Consensys (MetaMask • Linea • Infura • Consensys Academy)',
    period: '2023',
    lane: 'ecosystems',
    bullets: [
      'Managed Consensys Academy community and alumni growth.',
      'Created technical education for MetaMask, Linea, and Infura.',
      'Improved MetaMask UX literacy for everyday users.',
    ],
  },
];

export const skills = [
  {
    group: 'Core',
    items: ['Software Engineering', 'Technical Writing', 'Ecosystem Building']
  },
  {
    group: 'Web3 Ecosystems',
    items: ['MetaMask UX', 'Linea', 'Infura', 'Consensys Academy', 'Chainlink', 'Fuel Network', 'Hyperbolic', 'Solana', ]
  },
  {
    group: 'Community & Education',
    items: ['Technical Community Management', 'Protocol Education Development', 'Curriculum Engineering & Architecture', 'Technical Documentation', 'Ecosystem Builder']
  },
  {
    group: 'Social Impact',
    items: ['Education Access Advocacy', 'Youth Substance Abuse Advocacy', 'Pipelining African Engineers To Global Opportunities']
  },
  {
    group: 'Interests',
    items: ['Soccer (Will Never Like Man United)', 'Reading', 'Tennis', 'Swimming', 'Traveling']
  }
];

export const principles = [
  {
    title: 'Build for clarity before cleverness',
    desc: 'Readable, reviewable, and maintainable software outlives brilliant but fragile code.'
  }, 
  {
    title: 'Teach concepts before syntax',
    desc: 'People must first understand what a thing is and why it exists before learning how to type it.'
  },
  {
    title: 'Map primitives to the real world',
    desc: 'A technical primitive is only valuable if it anchors to an actual real-life use case or constraint.'
  },
  {
    title: 'Education must produce builders',
    desc: 'If learning does not convert into agency and shipped work, it is entertainment, not education.'
  },
  {
    title: 'Communities must produce value, not applause',
    desc: 'A strong community is a factory of outcomes, not a stadium of spectators.'
  },
  {
    title: 'Respect before hierarchy',
    desc: 'Status is not a license to be unkind, dignity is the first rule of coordination.'
  },
  {
    title: 'Trustlessness is the invariant',
    desc: 'Transparency and privacy are contextual tools, the system must never require a middleman to be safe.'
  },
  {
    title: 'Africa as a benchmark, not a handicap',
    desc: 'If a system cannot operate under African constraints, it is not resilient infrastructure.'
  },
  {
    title: 'Impact or it is irrelevant',
    desc: 'Technology must materially improve human lives, usefulness is the only justification for building.'
  }
];

export const story = {
  title: 'What do you want to know?',
  paragraphs: [
"Hi, I’m Opeyemi (or Bangkok if you know the full lore).", 
"I build in three lanes: software, technical education, and ecosystem growth. I’ve worked on improving MetaMask UX, created technical content for Linea & Infura, helped build Consensys Academy and its alumni community, and contributed to Chainlink, Hyperbolic and Fuel in both technical and non-technical roles.", 

"Outside “work-work”, I convene communities, speak publicly, and try to reduce real-world suffering, especially by helping underprivileged youth access education and avoid the traps of poverty and substance abuse.", 
"I believe web3 is only useful if it produces tangible outcomes for Africans, not aesthetics or applause.", 

"In short: I build, I teach, I serve, as best as I can.", 
  ],
};


