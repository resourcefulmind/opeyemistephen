import type { Metadata } from 'next';
import AboutPage from '@/components/press/AboutPage';
import PressLayout from '@/components/press/PressLayout';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Opeyemi Bangkok (Opeyemi Stephen): Education Architect at the Solana Foundation, technical writer and fintech co-founder in Lagos.',
  alternates: { canonical: 'https://www.opeyemibangkok.com/about' },
};

export default function About() {
  return (
    <PressLayout>
      <AboutPage />
    </PressLayout>
  );
}
