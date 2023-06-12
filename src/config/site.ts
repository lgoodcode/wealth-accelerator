import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Wealth Accelerator',
    template: '%s | Wealth Accelerator',
  },
  metadataBase: new URL('https://app.chirowealth.com'),
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
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://app.chirowealth.com',
    title: 'Wealth Accelerator',
    description: 'Wealth Accelerator app.',
    siteName: 'Wealth Accelerator',
    images: [
      {
        url: '/title-logo.png',
        width: 318,
        height: 85,
        alt: 'ChiroWealth logo with text',
      },
      {
        url: '/logo.png',
        width: 64,
        height: 52,
        alt: 'ChiroWealth logo',
      },
      {
        url: '/icon-logo-1231x1049.png',
        width: 1231,
        height: 1049,
        alt: 'ChiroWealth logo large with text below',
      },
      {
        url: '/icon-1024x1024.png',
        width: 1024,
        height: 1024,
        alt: 'ChiroWealth logo large',
      },
    ],
  },
}
