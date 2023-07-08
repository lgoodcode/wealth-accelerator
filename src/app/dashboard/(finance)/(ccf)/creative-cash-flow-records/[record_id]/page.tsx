import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { InputsCard } from '../components/inputs-card';
import { ResultsCard } from '../components/results-card';
import { TrendsCard } from '../components/trends-card';
import type { CreativeCashFlowRecord } from '../../types';

export const metadata: Metadata = {
  title: 'Shared Creative Cash Flow Record',
};

interface SharedCreativeCashFlowRecordPageProps {
  params: {
    record_id: string;
  };
  searchParams: {
    name: string;
  };
}

export default async function SharedCreativeCashFlowRecordPage({
  params: { record_id },
  searchParams: { name },
}: SharedCreativeCashFlowRecordPageProps) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  } else if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  const supabase = createSupabase();
  const { error, data } = await supabase
    .rpc('get_creative_cash_flow_record', {
      record_id: record_id,
    })
    .single();

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const record = data as unknown as CreativeCashFlowRecord;

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">
          {name ? `${name}'s ` : ''}Shared Creative Cash Flow Record
        </h2>
        <p className="text-muted-foreground">Viewing a shared record.</p>
      </div>
      <Separator className="mt-6" />
      <div className="flex flex-row justify-center w-full gap-8 flex-wrap">
        <InputsCard record={record} />
        <ResultsCard record={record} />
        <TrendsCard record={record} />
      </div>
    </div>
  );
}
