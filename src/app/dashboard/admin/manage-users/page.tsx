import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Manage Users',
};

export default async function ManageUsersPage() {
  const supabase = createSupabase(true);
  const { error, data } = await supabase.from('users').select('*');

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const users = (data ?? []) as User[];

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Manage Users</h2>
        <p className="text-muted-foreground">View, create, update, and delete users.</p>
      </div>
      <Separator className="mt-6" />
    </div>
  );
}
