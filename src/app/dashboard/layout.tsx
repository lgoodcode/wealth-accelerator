import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/getUser';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from './components/header';
import { QueryProvider } from './components/query-provider';
import { UserProvider } from './components/user-provider';

export const metadata: Metadata = {
  description: 'Wealth Accelerator app.',
  // Disable indexing for all pages that use this layout. This is useful for
  // pages that are only accessible to authenticated users.
  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * In the layout, we know the user is authenticated because the middleware refreshes the session
 * before rendering the page. Knowing that the session cookie is valid, we can directly get the user
 * id from it instead of having to make a duplicate request to the database to refresh/verify the session.
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={['light', 'dark', 'system']}
    >
      <UserProvider user={user}>
        <QueryProvider>
          <Header user={user} />
          {children}
          <Toaster />
        </QueryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
