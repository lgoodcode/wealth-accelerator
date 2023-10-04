import { metadata as siteMetadata } from '@/config/site';
import { inter, openSans } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';
import { TailwindIndicator } from '@/components/tailwind-indicator';

import '@/styles/globals.css';

export const metadata = siteMetadata;
export const dynamic = 'force-dynamic';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn('min-h-screen bg-background antialiased', inter.className, openSans.variable)}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
        <TailwindIndicator />
      </body>
    </html>
  );
}
