import type { Metadata } from 'next';
import About from '@/pages/About';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Opeyemi Stephen. Software engineer, technical writer, and ecosystem builder.',
  alternates: { canonical: 'https://www.opeyemibangkok.com/about' },
};

export default function AboutPage() {
  return <About />;
}
