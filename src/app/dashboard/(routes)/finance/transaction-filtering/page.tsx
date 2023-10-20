import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { HelpButton } from '@/components/help-button';
import { Separator } from '@/components/ui/separator';
import { UserPlaidFilters } from './components/user-plaid-filters';
import { UserTransactionFilteringHelpContent } from './user-transaction-filtering-help-content';
import type { Filter, UserFilter } from '@/lib/plaid/types/transactions';

export const metadata: Metadata = {
  title: 'Transactions Filtering',
};

export default async function UserTransactionFilteringPage() {
  const supabase = createSupabase();
  const { error: userFiltersError, data: userFiltersData } = await supabase
    .from('user_plaid_filters')
    .select('*')
    .order('id', { ascending: true });

  if (userFiltersError) {
    console.error(userFiltersError);
    captureException(userFiltersError);
    return <PageError />;
  }

  const { error: globalFiltersError, data: globalFiltersData } = await supabase
    .from('global_plaid_filters')
    .select('*')
    .order('id', { ascending: true });

  if (globalFiltersError) {
    console.error(globalFiltersError);
    captureException(globalFiltersError);
    return <PageError />;
  }

  const userFilters = (userFiltersData as UserFilter[]) ?? null;
  const globalFilters = (globalFiltersData as Filter[]) ?? null;

  return (
    <div className="p-8">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Transactions Filtering</h2>
          <p className="text-muted-foreground">
            Manage filters used to categorize your transactions when received from Plaid.
          </p>
        </div>

        <HelpButton
          title="User Transaction Filtering Help"
          content={UserTransactionFilteringHelpContent}
        />
      </div>
      <Separator className="mt-6" />
      <UserPlaidFilters userFiltersData={userFilters} globalFilters={globalFilters} />
    </div>
  );
}
