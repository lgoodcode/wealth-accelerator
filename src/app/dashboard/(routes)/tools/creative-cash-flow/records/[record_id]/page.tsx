import { captureException } from '@sentry/nextjs';
import { Album, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { isUUID } from '@/lib/utils/is-uuid';
import { PageError } from '@/components/page-error';
import { Breadcrumbs, BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { InputsCard } from '../components/inputs-card';
import { ResultsCard } from '../components/results-card';
import { TrendsCard } from '../components/trends-card';
import { NoRecordCard } from './no-record-card';
import type { CreativeCashFlowRecord } from '../../types';

export const metadata: Metadata = {
  title: 'Record | Creative Cash Flow',
};

interface CreativeCashFlowRecordPageProps {
  params: {
    record_id: string;
  };
  searchParams: {
    sharerName: string;
  };
}

export default async function CreativeCashFlowRecordPage({
  params: { record_id },
  searchParams: { sharerName },
}: CreativeCashFlowRecordPageProps) {
  if (!isUUID(record_id)) {
    return <NoRecordCard record_id={record_id} />;
  }

  const supabase = createSupabase();
  const { error, data } = await supabase
    .rpc('get_creative_cash_flow_record', { record_id: record_id })
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

  const record = data as unknown as CreativeCashFlowRecord;

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-3xl font-bold">Creative Cash Flow Record</h2>
            {sharerName && (
              <div className="flex flex-row gap-2 text-lg">
                <span className="text-muted-foreground">Shared by</span>
                <span className="font-bold">{sharerName}</span>
              </div>
            )}
          </div>
          {sharerName && <p className="text-muted-foreground">Viewing a shared record.</p>}
        </div>
        <Breadcrumbs>
          <BreadcrumbItem href="/dashboard/tools/creative-cash-flow/records">
            <Album size={16} className="mr-2" />
            Records
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <DollarSign size={16} className="mr-2" />
            {record.name}
          </BreadcrumbItem>
        </Breadcrumbs>
        <Separator className="mt-6" />
      </div>
      <div className="flex flex-row justify-center w-full gap-6 flex-wrap">
        <InputsCard record={record} />
        <ResultsCard record={record} />
        <TrendsCard record={record} />
      </div>
    </div>
  );
}
