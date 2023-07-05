import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Institutions } from './components/institutions';
import { ClientInstitution } from '@/lib/plaid/types/institutions';

export const metadata: Metadata = {
  title: 'Banking',
};

export default async function BankingPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('plaid')
    .select('item_id, name, expiration, cursor')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const institutions: ClientInstitution[] = data ?? [];

  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Banking</h2>
        <p className="text-muted-foreground">
          Manage institutions and view transactions for your bank accounts.
        </p>
      </div>
      <Separator className="mt-6" />
      <Institutions institutions={institutions} />
    </div>
  );
}
