import { captureException } from '@sentry/nextjs';
import type { Metadata } from 'next';

import { getUser } from '@/lib/supabase/server/get-user';
import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { PageError } from '@/components/page-error';
import { Badge } from '@/components/ui/badge';
import { HelpButton } from '@/components/help-button';
import { Separator } from '@/components/ui/separator';
import { CreativeCashFlowHelpContent } from '../creative-cash-flow-help-content';
import { VisualizerInputs } from '../components/visualizer/visualizer-inputs';
import { VisualizerResults } from '../components/visualizer/visualizer-results';
import type { VisualizerTransactions } from '../types';

export const metadata: Metadata = {
  title: 'Visualizer | Creative Cash Flow',
};

const getTransactions = async (user_id: string) => {
  const supabase = createSupabase();
  const { error, data } = await supabase
    .rpc('get_ccf_transactions_by_user_id', {
      user_id,
    })
    .single();

  if (error || !data) {
    return {
      error: error || new Error('No transactions returned'),
      data: null,
    };
  }

  return {
    error: null,
    data: {
      business: data.business,
      personal: data.personal,
    } as VisualizerTransactions,
  };
};

const getWaaInfo = async (user_id: string) => {
  const supabase = createSupabase();
  const { error, data } = await supabase
    .from('waa')
    .select('id, date, amount')
    .eq('user_id', user_id);

  if (error || !data) {
    return {
      error: error || new Error('No transactions returned'),
      data: null,
    };
  }

  return {
    error: null,
    data,
  };
};

const getBalanceEntries = async (user_id: string) => {
  const supabase = createSupabase();
  const { error, data } = await supabase.rpc('get_balances_entries', {
    user_id,
  });

  if (error || !data) {
    return {
      error: error || new Error('No transactions returned'),
      data: null,
    };
  }

  return {
    error: null,
    data,
  };
};

const getData = async (user_id: string) => {
  const [transactions, waaInfo] = await Promise.all([
    getTransactions(user_id),
    getWaaInfo(user_id),
    getBalanceEntries(user_id),
  ]);

  if (transactions.error || waaInfo.error) {
    return {
      error: transactions.error || waaInfo.error,
      data: null,
    };
  }

  return {
    error: null,
    data: {
      transactions: transactions.data,
      waaInfo: waaInfo.data,
      balanceEntries: waaInfo.data,
    },
  };
};

export default async function CreativeCashFlowVisualizerPage() {
  const user = (await getUser()) as User;
  const { error, data } = await getData(user.id);

  if (error) {
    console.error(error);
    captureException(error);
    return <PageError />;
  }

  const transactions = {
    business: data!.transactions.business,
    personal: data!.transactions.personal,
  } as VisualizerTransactions;

  console.log(data?.balanceEntries);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-row justify-between">
        <div className="space-y-1">
          <div className="flex flex-row items-center">
            <h2 className="text-3xl font-bold">Creative Cash Flow Visualizer</h2>
            <Badge className="ml-2 h-7" size="md">
              Beta
            </Badge>
          </div>
          {/* <p className="text-muted-foreground">
            Visually see to understand where your money is going.
          </p> */}
        </div>

        {/* <HelpButton title="Creative Cash Flow Help" content={CreativeCashFlowHelpContent} /> */}
      </div>
      <Separator className="mt-6" />
      <div className="grid grid-cols-12 gap-8 h-[800px]">
        <div className="col-span-3">
          <VisualizerInputs
            user_id={user.id}
            transactions={transactions}
            initial_WaaInfo={data!.waaInfo}
            initial_balance_entries={data!.balanceEntries}
          />
        </div>
        <div className="col-span-9">
          <VisualizerResults />
        </div>
      </div>
    </div>
  );
}
