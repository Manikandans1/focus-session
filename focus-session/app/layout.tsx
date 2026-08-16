import type { Metadata } from 'next';
import Script from 'next/script';
import { Fraunces, Public_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://focus-session-woad.vercel.app'),

  // Google AdSense site verification
  other: {
    'google-adsense-account': 'ca-pub-7067890046040375',
  },

  title: {
    default: 'Focus Session — Stop scrolling. Start watching with purpose.',
    template: '%s — Focus Session',
  },

  description:
    'Tell us what you need right now and how much time you have. Focus Session builds a short, useful YouTube watch session — no endless scrolling.',

  openGraph: {
    title: 'Focus Session — Stop scrolling. Start watching with purpose.',
    description:
      'Tell us what you need right now and how much time you have. Focus Session builds a short, useful YouTube watch session.',
    type: 'website',
    siteName: 'Focus Session',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Focus Session — Stop scrolling. Start watching with purpose.',
    description:
      'A focused YouTube session, sized to the time you actually have.',
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
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-canvas text-ink font-body antialiased flex flex-col">
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7067890046040375"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}