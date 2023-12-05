import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { HelpButton } from '@/components/help-button';
import { Separator } from '@/components/ui/separator';
import { Institutions } from './components/institutions';
import { BankingHelpContent } from './banking-help-content';

export const metadata: Metadata = {
  title: 'Banking',
};

export default async function BankingPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data: institutions } = await supabase
    .from('plaid')
    .select('item_id, name, expiration, cursor, new_accounts')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Banking</h2>
          <p className="text-muted-foreground">
            Manage institutions and view transactions for your bank accounts.
          </p>
        </div>

        <HelpButton title="Banking Help" content={BankingHelpContent} />
      </div>
      <Separator className="mt-6" />
      <Institutions institutionsData={institutions} />
    </div>
  );
}
