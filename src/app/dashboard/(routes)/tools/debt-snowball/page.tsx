import { captureException } from '@sentry/nextjs';

import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { DebtSnowball } from './components/debt-snowball';

export const metadata: Metadata = {
  title: 'Debt Snowball',
};

export default async function DebtSnowballPage() {
  const supabase = createSupabase();
  const { error, data: debts } = await supabase
    .from('debts')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <div className="flex flex-row items-center">
          <h2 className="text-3xl font-bold">Debt Snowball</h2>
        </div>
        <p className="text-muted-foreground">
          Quickly visualize different strategies for paying off your debt.
        </p>
      </div>
      <Separator className="mt-6" />
      <DebtSnowball debts={debts} />
    </div>
  );
}
