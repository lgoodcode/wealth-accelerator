import { captureException } from '@sentry/nextjs';
import { MoveDown } from 'lucide-react';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/get-user';
import { PageError } from '@/components/page-error';
import { HelpButton } from '@/components/help-button';
import { Separator } from '@/components/ui/separator';
import { CreativeCashFlow } from './components/creative-cash-flow';
import { getData } from './functions/get-data';
import { CreativeCashFlowHelpContent } from './creative-cash-flow-help-content';

export const metadata: Metadata = {
  title: 'Creative Cash Flow',
};

export default async function CreativeCashFlowPage() {
  const user = (await getUser()) as User;
  const { error, data } = await getData(user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Creative Cash Flow</h2>
          <p className="text-muted-foreground">Understanding where your money is going.</p>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center">
              <MoveDown className="w-7 h-7" />
              <span>Flow of money</span>
            </div>
            <div className="flex flex-row items-center">
              <MoveDown className="w-7 h-7 text-destructive" />
              <span>Taxes</span>
            </div>
          </div>

          <HelpButton title="Creative Cash Flow Help" content={CreativeCashFlowHelpContent} />
        </div>
      </div>
      <Separator className="mt-6" />
      <CreativeCashFlow
        user_id={user.id}
        initial_transactions={data.transactions}
        ytd_collections={data.ytd_collections}
        default_tax_rate={data.default_tax_rate}
      />
    </div>
  );
}
