import { redirect } from 'next/navigation';

import { getUser } from '@/lib/supabase/server/get-user';
import { isAdmin } from '@/lib/utils/is-admin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = (await getUser()) as User;

  if (!isAdmin(user)) {
    redirect('/dashboard/home');
  }

  return <>{children}</>;
}
