import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#040916' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Wealth Accelerator',
    template: '%s | Wealth Accelerator',
  },
  metadataBase: new URL('https://app.chirowealth.com'),
  keywords: ['Wealth Accelerator'],
  description: 'Wealth Accelerator app.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/img/icon.png',
    apple: '/img/icon.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://app.chirowealth.com',
    title: 'Wealth Accelerator',
    description: 'Wealth Accelerator app.',
    siteName: 'Wealth Accelerator',
    images: [
      {
        url: '/img/logo-318x85.png',
        width: 318,
        height: 85,
        alt: 'ChiroWealth logo with text',
      },
      {
        url: '/img/icon.png',
        width: 64,
        height: 52,
        alt: 'logo',
      },
      {
        url: '/img/icon-logo-1231x1049.png',
        width: 1231,
        height: 1049,
        alt: 'logo large with text below',
      },
      {
        url: '/img/icon-1024x1024.png',
        width: 1024,
        height: 1024,
        alt: 'logo large',
      },
    ],
  },
};
