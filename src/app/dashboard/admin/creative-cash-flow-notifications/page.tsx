import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Notifiers } from './components/notifiers';
import type { Notifier } from './types';

export const metadata: Metadata = {
  title: 'CCF Notifications',
};

export default async function CreativeCashFlowNotificationsPage() {
  const supabase = createSupabase();
  const { error, data } = await supabase.from('creative_cash_flow_notifiers').select('*');

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const notifiers = (data ?? []) as Notifier[];

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow Notifications</h2>
        <p className="text-muted-foreground">
          Manage the emails that will be notified when a user shares a Creative Cash Flow Record.
        </p>
      </div>
      <Separator className="mt-6" />
      <Notifiers notifiersData={notifiers} />
    </div>
  );
}
