import type { Metadata } from 'next';
import CommunityPage from '@/components/press/CommunityPage';
import PressLayout from '@/components/press/PressLayout';

export const metadata: Metadata = {
  title: 'Community',
  description: 'The community notice board: builders wanted, meetups to come, and a way to hear first when this section goes to press.',
  alternates: { canonical: 'https://www.opeyemibangkok.com/community' },
};

export default function Community() {
  return (
    <PressLayout>
      <CommunityPage />
    </PressLayout>
  );
}
