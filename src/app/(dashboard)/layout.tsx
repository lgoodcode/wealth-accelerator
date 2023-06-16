import { Metadata } from 'next';

import { createSupabaseServer } from '@/lib/supabase/server';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/dashboard/header';
import { Session } from '@supabase/supabase-js';

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
    data: { session: _session },
  } = await supabase.auth.getSession();
  const session = _session as Session;

  const user: User = {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.user_metadata.name,
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <>
        <Header user={user} />
        {children}
      </>
    </ThemeProvider>
  );
}
