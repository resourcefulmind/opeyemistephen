import type { Metadata } from 'next';
import AboutPage from '@/components/press/AboutPage';
import PressLayout from '@/components/press/PressLayout';
import { SITE_URL, personJsonLd, seo } from '@/content/identity';

export const metadata: Metadata = {
  title: { absolute: seo.aboutTitle },
  description: seo.aboutDescription,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { title: seo.aboutTitle, description: seo.aboutDescription, url: `${SITE_URL}/about` },
  twitter: { title: seo.aboutTitle, description: seo.aboutDescription },
};

export default function About() {
  return (
    <PressLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            url: `${SITE_URL}/about`,
            mainEntity: personJsonLd,
          }),
        }}
      />
      <AboutPage />
    </PressLayout>
  );
}
