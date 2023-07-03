import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Wealth Accelerator',
    template: '%s | Wealth Accelerator',
  },
  metadataBase: new URL('https://test.chirowealth.com'),
  keywords: ['Wealth Accelerator'],
  description: 'Wealth Accelerator app.',
  colorScheme: 'normal',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#040916' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://test.chirowealth.com',
    title: 'Wealth Accelerator',
    description: 'Wealth Accelerator app.',
    siteName: 'Wealth Accelerator',
    images: [
      {
        url: '/img/title-logo.png',
        width: 318,
        height: 85,
        alt: 'ChiroWealth logo with text',
      },
      {
        url: '/img/logo.png',
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
