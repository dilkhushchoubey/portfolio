import type { Metadata, Viewport } from 'next';
import { Newsreader, Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { siteConfig } from '@/data/siteConfig';
import '@/styles/globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const viewport: Viewport = {
  themeColor: '#fcfbfa',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://dilkhushchoubey.com'),
  title: {
    default: `${siteConfig.name} — ${siteConfig.profession}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortBio,
  keywords: [
    'Dilkhush Choubey',
    'Photographer',
    'India',
    'Documentary Photography',
    'Kumartuli',
    'Rolls Royce Holi',
    'Varanasi Ghats',
    'Indian Photography',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dilkhushchoubey.com',
    title: `${siteConfig.name} — ${siteConfig.profession}`,
    description: siteConfig.shortBio,
    siteName: siteConfig.name,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="site-wrapper">
        <Navigation />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
