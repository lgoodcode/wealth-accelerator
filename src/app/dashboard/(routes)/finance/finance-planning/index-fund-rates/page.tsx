import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { Separator } from '@/components/ui/separator';
import { PageError } from '@/components/page-error';
import { RatesForm } from './rates-form';

export default async function IndexFundRatesPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('personal_finance')
    .select('rates')
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
        <h3 className="text-lg font-medium">Index Fund Rates</h3>
        <p className="text-sm text-muted-foreground">
          Specify the rates of return for your index funds over the next 60 years. Or set a flat
          rate for all years.
        </p>
      </div>
      <Separator />
      <div className="max-w-xl">
        <RatesForm user={user} rates={data?.rates} />
      </div>
    </div>
  );
}
