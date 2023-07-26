import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { CcfContainer } from './components/ccf-container';
import { CcfResults } from './components/ccf-results';
import { getData } from './functions/get-data';

export const metadata: Metadata = {
  title: 'Creative Cash Flow',
};

export default async function CreativeCashFlowCalculatePage() {
  const user = (await getUser()) as User;
  const { error, data } = await getData(user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Creative Cash Flow</h2>
        <p className="text-muted-foreground">Understanding where your money is going.</p>
      </div>
      <Separator className="mt-6" />
      <CcfContainer
        user_id={user.id}
        transactions={data.transactions}
        ytd_collections={data.ytd_collections}
        default_tax_rate={data.default_tax_rate}
      />
      <CcfResults />
    </div>
  );
}
