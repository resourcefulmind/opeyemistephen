import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Community space for builders, writers, and learners. Coming soon.',
  alternates: { canonical: 'https://www.opeyemibangkok.com/community' },
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Community</h1>
        <p className="text-lg text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}
