import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Creative Cash Flow Records',
};

export default async function CreativeCashFlowRecordsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // const supabase = createSupabase();
  // const { error: transactionsError, data } = await supabase.rpc('get_transactions_by_user_id', {
  //   arg_user_id: user.id,
  // });

  // if (transactionsError || !data) {
  //   const error = transactionsError || new Error('No data returned');
  //   console.error(error);
  //   captureException(error);
  //   return <PageError />;
  // }

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow</h2>
        <p className="text-muted-foreground">
          View where your money is going and how much you are saving.
        </p>
      </div>
      <Separator className="mt-6" />
    </div>
  );
}
