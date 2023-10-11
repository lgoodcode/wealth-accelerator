import { captureException } from '@sentry/nextjs';
import { Album } from 'lucide-react';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { CreativeCashFlowRecords } from './components/creative-cash-flow-records';
import type { CreativeCashFlowRecord } from '../types';

export const metadata: Metadata = {
  title: 'Records | Creative Cash Flow',
};

export default async function CreativeCashFlowRecordsPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase.rpc('get_creative_cash_flow_records', {
    _user_id: user.id,
  });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const records = data as unknown as CreativeCashFlowRecord[];

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Creative Cash Flow Records</h2>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem active>
            <Album size={16} className="mr-2" />
            Records
          </BreadcrumbItem>
        </Breadcrumbs>
        <Separator />
      </div>
      <CreativeCashFlowRecords recordsData={records} />
    </div>
  );
}
