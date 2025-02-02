import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { HelpButton } from '@/components/help-button';
import { Separator } from '@/components/ui/separator';
import { Debts } from './debts';
import { DebtsHelpContent } from './debts-help-content';

export const metadata: Metadata = {
  title: 'Debts',
};

export default async function DebtPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data: debts } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', user.id)
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Debts</h2>
          <p className="text-muted-foreground">
            Manage debt information such as credit cards, loans, and mortgages.
          </p>
        </div>

        <HelpButton title="Debts Help" content={DebtsHelpContent} />
      </div>
      <Separator className="mt-6" />
      <Debts debtsData={debts} />
    </div>
  );
}
