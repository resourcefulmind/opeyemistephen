import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { MobileNavProvider } from '@/contexts/MobileNavContext';
import SiteChrome from '@/components/site/SiteChrome';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.opeyemibangkok.com'), 
    title: {
        default: 'Opeyemi Stephen - Software Engineer & Technical Writer',
        template: '%s | Opeyemi Stephen', 
    }, 
    description: 'Opeyemi Stephen. Software Engineer, Technical Writer & Ecosystem Builder. Building the future of web3 and developer education. Explore my technical articles and projects.', 
    keywords: [
        'software engineer',
        'technical writer',
        'web3',
        'blockchain',
        'React',
        'TypeScript',
        'developer education',
    ], 
    authors: [{ name: 'Opeyemi Stephen', url: 'https://www.opeyemibangkok.com' }], 
    creator: 'Opeyemi Stephen', 
    robots: { index: true, follow: true }, 
    openGraph: {
        type: 'website', 
        siteName: 'Opeyemi Stephen', 
        title: 'Opeyemi Stephen - Software Engineer & Technical Writer', 
        description: 'Building the future of web3 and developer education. Explore my technical articles and projects.', 
        url: 'https://www.opeyemibangkok.com', 
        locale: 'en_US', 
        images: [
            { 
                url: 'https://www.opeyemibangkok.com/preview.png',  
                width: 1182, 
                height: 806, 
                alt: 'Opeyemi Stephen - Portfolio Preview', 
            }, 
        ], 
    }, 
    twitter: {
        card: 'summary_large_image', 
        title: 'Opeyemi Stephen - Software Engineer & Technical Writer', 
        description: 'Building the future of web3 and developer education. Explore my technical articles and projects.', 
        images: ['https://www.opeyemibangkok.com/preview.png'], 
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
        canonical: 'https://www.opeyemibangkok.com',
    },
};

export const viewport: Viewport = {
    themeColor: '#5046e6', 
}

const themeInitScript = `
    (function() {
        try{
            var stored = localStorage.getItem('theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = stored || (prefersDark ? 'dark' : 'light');
            document.documentElement.classList.add(theme); 
        } catch (e) {}
    })();
`;

export default function RootLayout({
    children, 
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body className="bg-background text-foreground">
                <MobileNavProvider>
                    <SiteChrome>{children}</SiteChrome>
                </MobileNavProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}