import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { Separator } from '@/components/ui/separator';
import { PageError } from '@/components/page-error';
import { Balances } from './components/balances';

export default async function AccountBalancesPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('balances_accounts')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Account Balances</h3>
        <p className="text-sm text-muted-foreground">
          Manage the balances on your accounts to be used in the CCF Visualizer.
        </p>
      </div>
      <Separator />
      <div className="max-w-xl">
        <Balances initial_accounts={data} />
      </div>
    </div>
  );
}
