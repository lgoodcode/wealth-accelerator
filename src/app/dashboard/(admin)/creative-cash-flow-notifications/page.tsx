import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import type { Filter } from '@/lib/plaid/types/transactions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'CCF Notifications',
};

export default async function CreativeCashFlowNotificationsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  } else if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  // const supabase = createSupabase();
  // const { error, data } = await supabase.from('plaid_filters').select('*');

  // if (error) {
  //   console.error(error);
  //   captureException(error);
  //   return <PageError />;
  // }

  // const filters: Filter[] = (data as Filter[]) ?? [];

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow Notifications</h2>
        <p className="text-muted-foreground">
          Manage the emails that will be notified when a user shares a Creative Cash Flow Record.
        </p>
      </div>
      <Separator className="mt-6" />
    </div>
  );
}
