import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { UserPlaidFilters } from './components/user-plaid-filters';
import type { UserFilter } from '@/lib/plaid/types/transactions';

export const metadata: Metadata = {
  title: 'Transactions Filtering',
};

export default async function UserTransactionFilteringPage() {
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('user_plaid_filters')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const filters = (data as UserFilter[]) ?? null;

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Transactions Filtering</h2>
        <p className="text-muted-foreground">
          Manage filters used to categorize your transactions when received from Plaid.
        </p>
      </div>
      <Separator className="mt-6" />
      <UserPlaidFilters userFiltersData={filters} />
    </div>
  );
}
