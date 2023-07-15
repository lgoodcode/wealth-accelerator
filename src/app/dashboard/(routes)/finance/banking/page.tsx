import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Institutions } from './components/institutions';

export const metadata: Metadata = {
  title: 'Banking',
};

export default async function BankingPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data: institutions } = await supabase
    .from('plaid')
    .select('item_id, name, expiration, cursor')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Banking</h2>
        <p className="text-muted-foreground">
          Manage institutions and view transactions for your bank accounts.
        </p>
      </div>
      <Separator className="mt-6" />
      <Institutions institutionsData={institutions} />
    </div>
  );
}
