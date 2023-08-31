import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Records } from './components/records';
import type { CreativeCashFlowRecord } from '../types';

export const metadata: Metadata = {
  title: 'Creative Cash Flow Records',
};

export default async function CreativeCashFlowRecordsPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase.rpc('get_creative_cash_flow_records', {
    arg_user_id: user.id,
  });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const records = data as unknown as CreativeCashFlowRecord[];

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow Records</h2>
        <p className="text-muted-foreground">
          View records saved from the Creative Cash Flow page.
        </p>
      </div>
      <Separator className="mt-6" />
      <Records recordsData={records} />
    </div>
  );
}
