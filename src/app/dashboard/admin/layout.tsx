import { redirect } from 'next/navigation';

import { getUser } from '@/lib/supabase/server/getUser';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  } else if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
