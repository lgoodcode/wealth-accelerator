import { redirect } from 'next/navigation';

import { getUser } from '@/lib/supabase/server/getUser';
import { isAdmin } from '@/lib/utils/isAdmin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = (await getUser()) as User;

  if (!isAdmin(user)) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
