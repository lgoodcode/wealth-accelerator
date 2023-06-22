import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabaseServer } from '@/lib/supabase/server';
import { authCookieParser } from '@/lib/supabase/parseAuthCookie';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from './components/user-provider';
import { Header } from './components/header';

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
  const supabase = createSupabaseServer();
  const authToken = authCookieParser(cookies());

  const { error: errorUser, data: user } = await supabase
    .from('users')
    .select()
    .eq('id', authToken?.sub)
    .single();

  if (errorUser) {
    console.error('DashboardLayout error', errorUser);
    captureException(errorUser);
  }

  if (errorUser || !user) {
    redirect('/login');
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UserProvider user={user}>
        <Header user={user} />
        {children}
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
}
