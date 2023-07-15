import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/getUser';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/components/user-provider';
import { Header } from './components/header';
import { QueryProvider } from './components/query-provider';
import { ToastProvider } from './components/toast-provider';

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
          <Header />
          <div className="absolute -z-10 opacity-40 h-full w-full hidden dark:flex flex-col flex-grow bg-right-top bg-no-repeat bg-[url('/img/bg-gradient.svg')]" />
          {children}
        </QueryProvider>
        <ToastProvider />
      </UserProvider>
    </ThemeProvider>
  );
}
