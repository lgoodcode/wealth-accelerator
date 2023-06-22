import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabaseServer } from '@/lib/supabase/server';
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

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = createSupabaseServer();
  const {
    error: errorSession,
    data: { session: _session },
  } = await supabase.auth.getSession();
  const session = _session || null;

  if (errorSession) {
    console.error(errorSession);
    captureException(errorSession);
    return;
  }

  if (!session) {
    redirect('/login');
  }

  const { error: errorUser, data: user } = await supabase
    .from('users')
    .select()
    .eq('id', session.user.id)
    .single();

  if (errorUser) {
    console.error(errorUser);
    captureException(errorUser);
    return;
  }

  if (!user) {
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
