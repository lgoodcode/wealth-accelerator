import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/getUser';
import { PageError } from '@/components/page-error';
import { Separator } from '@/components/ui/separator';
import { Container } from './components/container';
import { Results } from './components/results';
import { getData } from './getData';

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
        <p className="text-muted-foreground">
          View where your money is going and how much you are saving.
        </p>
      </div>
      <Separator className="mt-6" />
      <Container
        user_id={user.id}
        transactions={data.transactions}
        ytd_collections={data.ytd_collections}
      />
      <Results />
    </div>
  );
}
