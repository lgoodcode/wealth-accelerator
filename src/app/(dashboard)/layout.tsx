import { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  description: 'Wealth Accelerator app.',
  // Disable indexing for all pages that use this layout. This is useful for
  // pages that are only accessible to authenticated users.
  robots: {
    index: false,
    follow: false,
  },
}
interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
