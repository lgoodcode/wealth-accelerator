import { captureException } from '@sentry/nextjs';
import { MountainSnow } from 'lucide-react';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { DebtSnowballRecords } from './components/debt-snowball-records';
import type { DebtSnowballRecord } from '../types';

export const metadata: Metadata = {
  title: 'Records | Debt Snowball',
};

export default async function DebtSnowballRecordsPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase.rpc('get_debt_snowball_records', {
    _user_id: user.id,
  });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const records = data as unknown as DebtSnowballRecord[];

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Debt Snowball Records</h2>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem active>
            <MountainSnow size={16} className="mr-2" />
            Records
          </BreadcrumbItem>
        </Breadcrumbs>
        <Separator />
      </div>
      <DebtSnowballRecords recordsData={records} />
    </div>
  );
}
