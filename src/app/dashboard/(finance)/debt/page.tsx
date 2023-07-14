import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Debts } from './components/debts';

export const metadata: Metadata = {
  title: 'Debt',
};

export default async function DebtPage() {
  const supabase = createSupabase();
  const { error, data } = await supabase.from('debts').select('*').order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Transactions Filtering</h2>
        <p className="text-muted-foreground">
          Manage filters used to categorize transactions when received from Plaid.
        </p>
      </div>
      <Separator className="mt-6" />
      <Debts debtsData={data} />
    </div>
  );
}
