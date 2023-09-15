import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { isUUID } from '@/lib/utils/is-uuid';
import { isAdmin } from '@/lib/utils/is-admin';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
// import { InputsCard } from '../components/inputs-card';
// import { ResultsCard } from '../components/results-card';
// import { TrendsCard } from '../components/trends-card';
import { NoRecordCard } from './no-record-card';
import type { DebtSnowballRecord } from '../../types';
import { restoreLastArrayToLastZero } from '../../utils/multi-dim-arr-padding';

export const metadata: Metadata = {
  title: 'Record | Debt Snowball',
};

interface DebtSnowballRecordPageProps {
  params: {
    record_id: string;
  };
  searchParams: {
    name: string;
  };
}

export default async function DebtSnowballRecordPage({
  params: { record_id },
  searchParams: { name },
}: DebtSnowballRecordPageProps) {
  const user = (await getUser()) as User;

  if (!isUUID(record_id)) {
    return <NoRecordCard record_id={record_id} />;
  }

  const supabase = createSupabase();
  const { error, data } = await supabase
    .rpc('get_debt_snowball_data_record', { record_id })
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return <NoRecordCard record_id={record_id} />;
    } else {
      console.error(error, { record_id });
      captureException(error, {
        extra: { record_id },
      });
      return <PageError />;
    }
  }

  if (!data) {
    return <NoRecordCard record_id={record_id} />;
  }

  const record = data as DebtSnowballRecord;

  // Don't allow users to view records that aren't theirs unless they're an admin.
  if (record.user_id !== user.id && !isAdmin(user)) {
    return <NoRecordCard record_id={record_id} />;
  }

  // When retrieving the data, need to use the restoreLastArrayToLastZero
  // util function to restore the array to its original state for the following properties:
  restoreLastArrayToLastZero(record.results.current.balance_tracking);
  restoreLastArrayToLastZero(record.results.strategy.balance_tracking);
  restoreLastArrayToLastZero(record.results.strategy.loan_payback.tracking);

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-3xl font-bold">Debt Snowball Record</h2>
          {name && (
            <div className="flex flex-row gap-2 text-lg">
              <span className="text-muted-foreground">Shared by</span>
              <span className="font-bold">{name}</span>
            </div>
          )}
        </div>
        {name && <p className="text-muted-foreground">Viewing a shared record.</p>}
      </div>
      <Separator className="mt-6" />
      <div className="flex flex-row justify-center w-full gap-6 flex-wrap">
        {/* <InputsCard record={record} />
        <ResultsCard record={record} />
        <TrendsCard record={record} /> */}
      </div>
    </div>
  );
}
