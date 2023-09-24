import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Filters } from './components/filters';
import type { Filter } from '@/lib/plaid/types/transactions';

export const metadata: Metadata = {
  title: 'Global Transactions Filtering',
};

export default async function GlobalTransactionFilteringPage() {
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('global_plaid_filters')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const filters = (data as Filter[]) ?? null;

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Global Transactions Filtering</h2>
        <p className="text-muted-foreground">
          Manage filters used to categorize transactions when received from Plaid for all users.
        </p>
        <p className="text-muted-foreground">
          <b>Note:</b> These filters can be overriden by user-specific filters.
        </p>
      </div>
      <Separator className="mt-6" />
      <Filters filtersData={filters} />
    </div>
  );
}
