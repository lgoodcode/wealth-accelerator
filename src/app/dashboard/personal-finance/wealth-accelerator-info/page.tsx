import { captureException } from '@sentry/nextjs';

import { createSupabaseServer } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/getUser';
import { Separator } from '@/components/ui/separator';
import { PageError } from '@/components/page-error';
import { WaInfoForm } from './wa-info-form';

export default async function WealthAcceleratorInfoPage() {
  const supabase = createSupabaseServer();
  const user = await getUser();

  const { error, data } = await supabase
    .from('personal_finance')
    .select()
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error(error);
    captureException(error);

    return <PageError />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Wealth Accelerator Information</h3>
        <p className="text-sm text-muted-foreground">
          Manage information used in calculations for your finances for the Wealth Accelerator.
        </p>
      </div>
      <Separator />
      <WaInfoForm initialValues={data} />
    </div>
  );
}
