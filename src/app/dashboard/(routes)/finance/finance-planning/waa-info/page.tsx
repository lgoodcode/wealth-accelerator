import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { getUser } from '@/lib/supabase/server/get-user';
import { Separator } from '@/components/ui/separator';
import { PageError } from '@/components/page-error';
// import { WaaInfoForm } from './waa-info-form';

export default async function WaaInfoPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('waa')
    .select('id, date, amount')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">WAA Information</h3>
        <p className="text-sm text-muted-foreground">Manage your actual WAA deposits.</p>
      </div>
      <Separator />
      <div className="max-w-xl">{/* <WaaInfoForm user={user} initialValues={data} /> */}</div>
    </div>
  );
}
