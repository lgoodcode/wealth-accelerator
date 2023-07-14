import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Calculate } from './components/calculate';

import { Transaction } from '@/lib/plaid/types/transactions';
import { Results } from './components/results';

export const metadata: Metadata = {
  title: 'Creative Cash Flow',
};

export default async function CreativeCashFlowCalculatePage() {
  const user = (await getUser()) as User;
  // Get all of the users transactions data split into business and personal
  const supabase = createSupabase();
  const { error: transactionsError, data } = await supabase.rpc('get_transactions_by_user_id', {
    arg_user_id: user.id,
  });

  if (transactionsError || !data) {
    const error = transactionsError || new Error('No data returned');
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const transactions = data as {
    business: Transaction[];
    personal: Transaction[];
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow</h2>
        <p className="text-muted-foreground">
          View where your money is going and how much you are saving.
        </p>
      </div>
      <Separator className="mt-6" />
      <Calculate userId={user.id} transactions={transactions} />
      <Results />
    </div>
  );
}
