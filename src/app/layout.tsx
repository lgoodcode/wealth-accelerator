import { metadata as siteMetadata, viewport as siteViewport } from '@/config/site';
import { inter, openSans } from '@/lib/fonts';
import { cn } from '@/lib/utils/cn';
import { TailwindIndicator } from '@/components/tailwind-indicator';

import '@/styles/globals.css';

export const metadata = siteMetadata;
export const viewport = siteViewport;
export const dynamic = 'force-dynamic';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        // Use className when utilizing it in a class and variable when using it as a CSS variable,
        // which is being used for the openSans in the tailwind config file
        className={cn('min-h-screen bg-background antialiased', inter.className, openSans.variable)}
      >
        <div className="relative flex min-h-screen flex-col">
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
        <TailwindIndicator />
      </body>
    </html>
  );
}
