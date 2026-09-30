import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Archivo, Newsreader } from 'next/font/google';
import { DISPLAY_NAME, SITE_URL, seo } from '@/content/identity';

const archivo = Archivo({
    subsets: ['latin'],
    axes: ['wdth'],
    variable: '--font-archivo',
    display: 'swap',
});

const newsreader = Newsreader({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-newsreader',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: seo.homeTitle,
        template: `%s | ${DISPLAY_NAME}`,
    },
    description: seo.homeDescription,
    keywords: [
        'Opeyemi Bangkok',
        'Opeyemi Stephen',
        'Web3 infrastructure',
        'African fintech',
        'Solana',
        'developer education',
        'developer relations',
        'technical writer',
    ],
    authors: [{ name: DISPLAY_NAME, url: SITE_URL }],
    creator: DISPLAY_NAME,
    robots: { index: true, follow: true },
    openGraph: {
        type: 'website',
        siteName: DISPLAY_NAME,
        title: seo.homeTitle,
        description: seo.homeDescription,
        url: SITE_URL,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: seo.homeTitle,
        description: seo.homeDescription,
        creator: '@devvgbg',
        site: '@devvgbg',
    },
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/site.webmanifest',
    alternates: {
        canonical: SITE_URL,
    },
};

export const viewport: Viewport = {
    themeColor: '#5046e6', 
}

const themeInitScript = `
    (function() {
        try {
            var root = document.documentElement;
            var stored = localStorage.getItem('theme');
            var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = stored || (prefersDark ? 'dark' : 'light');
            root.classList.add(theme);
        } catch (e) {}
    })();
`;

export default function RootLayout({
    children, 
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${archivo.variable} ${newsreader.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body className="bg-background text-foreground">
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}