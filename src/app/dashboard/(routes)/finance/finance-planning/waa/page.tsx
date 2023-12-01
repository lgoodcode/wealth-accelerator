import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { Separator } from '@/components/ui/separator';
import { PageError } from '@/components/page-error';
import { FinanceInfoForm } from './finance-info-form';

export default async function FinanceInfoPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('personal_finance')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Finance Information</h3>
        <p className="text-sm text-muted-foreground">
          Manage information used in calculations for your finances for the Wealth Accelerator and
          Creative Cash Flow.
        </p>
      </div>
      <Separator />
      <div className="max-w-xl">
        <FinanceInfoForm user={user} initialValues={data} />
      </div>
    </div>
  );
}
