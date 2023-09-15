import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { DebtSnowballRecords } from './components/debt-snowball-records';
import type { DebtSnowballRecord } from '../types';

export const metadata: Metadata = {
  title: 'Debt Snowball Records',
};

export default async function DebtSnowballRecordsPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase.rpc('get_debt_snowball_data_records', {
    _user_id: user.id,
  });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const records = data as unknown as DebtSnowballRecord[];

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Debt Snowball Records</h2>
        <p className="text-muted-foreground">View records saved from the Debt Snowball page.</p>
      </div>
      <Separator className="mt-6" />
      <DebtSnowballRecords recordsData={records} />
    </div>
  );
}
