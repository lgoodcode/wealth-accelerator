import { metadata as siteMetadata } from '@/config/site';
import { Inter } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';
import { TailwindIndicator } from '@/components/tailwind-indicator';

import '@/styles/globals.css';

export const metadata = siteMetadata;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased', Inter.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
        <TailwindIndicator />
      </body>
    </html>
  );
}
