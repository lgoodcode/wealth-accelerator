import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/get-user';
import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { HelpButton } from '@/components/help-button';
import { Separator } from '@/components/ui/separator';
import { CreativeCashFlowHelpContent } from '../creative-cash-flow-help-content';
import { VisualizerInputs } from '../components/visualizer/VisualizerInputs';
import { VisualizerResults } from '../components/visualizer/VisualizerResults';
import type { CcfTransaction } from '../types';

export const metadata: Metadata = {
  title: 'Visualizer | Creative Cash Flow',
};

export default async function CreativeCashFlowVisualizerPage() {
  const user = (await getUser()) as User;
  const supabase = createSupabase();
  const { error, data } = await supabase
    .rpc('get_ccf_transactions_by_user_id', {
      user_id: user.id,
    })
    .single();

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const transactions = {
    business: (data.business || []) as CcfTransaction[],
    personal: (data.personal || []) as CcfTransaction[],
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Creative Cash Flow Visualizer</h2>
          {/* <p className="text-muted-foreground">
            Visually see to understand where your money is going.
          </p> */}
        </div>

        {/* <HelpButton title="Creative Cash Flow Help" content={CreativeCashFlowHelpContent} /> */}
      </div>
      <Separator className="mt-6" />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <VisualizerInputs transactions={transactions} />
        </div>
        <div className="col-span-9">
          <VisualizerResults />
        </div>
      </div>
    </div>
  );
}
