import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { getUser } from '@/lib/supabase/server/getUser';
import { Separator } from '@/components/ui/separator';
import { PageError } from '@/components/page-error';
import { WaInfoForm } from './wa-info-form';

export default async function WealthAcceleratorInfoPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  } else if (user.role !== 'admin') {
    redirect('/dashboard');
  }

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
        <h3 className="text-lg font-medium">Wealth Accelerator Information</h3>
        <p className="text-sm text-muted-foreground">
          Manage information used in calculations for your finances for the Wealth Accelerator.
        </p>
      </div>
      <Separator />
      <div className="max-w-xl">
        <WaInfoForm user={user} initialValues={data} />
      </div>
    </div>
  );
}
