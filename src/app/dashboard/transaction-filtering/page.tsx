import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Filters } from './components/filters';
import type { Filter } from '@/lib/plaid/types/transactions';

export const metadata: Metadata = {
  title: 'Transactions Filtering',
};

export default async function TransactionFilteringPage() {
  const supabase = createSupabase();

  const { error, data } = await supabase.from('plaid_filters').select('*');

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const filters: Filter[] = (data as Filter[]) ?? [];

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Transactions Filtering</h2>
        <p className="text-muted-foreground">
          Manage filters used to categorize transactions when received from Plaid.
        </p>
      </div>
      <Separator className="mt-6" />
      <Filters filters={filters} />
    </div>
  );
}
