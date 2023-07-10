import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Notifiers } from './components/notifiers';

export const metadata: Metadata = {
  title: 'CCF Notifications',
};

export default async function CreativeCashFlowNotifiersPage() {
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('creative_cash_flow_notifiers')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow Notifiers</h2>
        <p className="text-muted-foreground">
          Manage the emails that will be notified when a user shares a Creative Cash Flow Record.
        </p>
      </div>
      <Separator className="mt-6" />
      <Notifiers notifiersData={data} />
    </div>
  );
}
