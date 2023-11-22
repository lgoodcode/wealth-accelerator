'use client';

import { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { supabase } from '@/lib/supabase/client';
import { PageError } from '@/components/page-error';
import { Loading } from '@/components/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ccfResultsAtom, hasActualWaaAtom, resetCreativeCashFlowInputsAtom } from '../atoms';
import { SaveAndResetButtons } from './save-and-reset-buttons';
import { CreativeCashFlowInputs } from './creative-cash-flow-inputs';
import { CreativeCashFlowResults } from './creative-cash-flow-results';
import type { Transaction } from '@/lib/plaid/types/transactions';
import { set } from 'date-fns';

enum TabsValue {
  Inputs = 'inputs',
  Results = 'results',
}

interface CcfContainerProps {
  user_id: string;
  initial_transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
  ytd_collections: number;
  default_tax_rate: number;
}

const getTransactions = async (user_id: string) => {
  const { error: transactionsError, data: transactionsData } = await supabase.rpc(
    'get_transactions_by_user_id',
    { user_id }
  );

  if (transactionsError || !transactionsData) {
    throw transactionsError || new Error('No transactionsData returned');
  }

  return transactionsData as {
    business: Transaction[];
    personal: Transaction[];
  };
};

export function CreativeCashFlow({
  user_id,
  initial_transactions,
  ytd_collections,
  default_tax_rate,
}: CcfContainerProps) {
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Inputs);
  const [results, setResults] = useAtom(ccfResultsAtom);
  const resetCreativeCashFlowInput = useSetAtom(resetCreativeCashFlowInputsAtom);
  const [hasAnimated, setHasAnimated] = useState(false);
  const setHasActualWaa = useSetAtom(hasActualWaaAtom);
  const [updatedAt, setUpdatedAt] = useState<number>(Date.now());
  const [isMounted, setIsMounted] = useState(false);
  const {
    isError,
    isFetching,
    isRefetching,
    dataUpdatedAt,
    data: transactions,
  } = useQuery<{
    business: Transaction[];
    personal: Transaction[];
  }>(['ccf'], () => getTransactions(user_id), {
    initialData: initial_transactions,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const handleReset = () => {
    setActiveTab(TabsValue.Inputs);
    setResults(null);
    resetCreativeCashFlowInput();
    setHasAnimated(false);
    setHasActualWaa(null);
  };

  const onTabChange = (value: string) => {
    const newTab = value === TabsValue.Inputs ? TabsValue.Inputs : TabsValue.Results;
    setActiveTab(newTab);
    // When changing tab back to inputs, set hasAnimated to true
    if (!hasAnimated && newTab === TabsValue.Inputs) {
      setHasAnimated(true);
    }
  };

  useEffect(() => {
    if (activeTab === TabsValue.Inputs && results) {
      setActiveTab(TabsValue.Results);
    }
  }, [results]);

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    if (dataUpdatedAt !== updatedAt) {
      setUpdatedAt(dataUpdatedAt);
      toast.info('Transaction data updated, please recalculate results.');
    }
  }, [dataUpdatedAt]);

  if (isError) {
    return <PageError />;
  } else if (isFetching) {
    return (
      <Loading title={isRefetching ? 'Refetching Data' : 'Fetching Data'} className="mt-0 py-32" />
    );
  }

  return (
    <Tabs className="w-full" value={activeTab} onValueChange={onTabChange}>
      <div className="relative mb-8 flex flex-row justify-center items-center gap-2">
        <TabsList className="relative grid w-[360px] grid-cols-2">
          <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger>
          <TabsTrigger value={TabsValue.Results} disabled={!results}>
            Results
          </TabsTrigger>
          <SaveAndResetButtons
            className="absolute left-[360px]"
            user_id={user_id}
            handleReset={handleReset}
          />
        </TabsList>
      </div>
      <TabsContent value={TabsValue.Inputs}>
        <CreativeCashFlowInputs
          user_id={user_id}
          transactions={transactions}
          ytd_collections={ytd_collections}
          default_tax_rate={default_tax_rate}
        />
      </TabsContent>
      <TabsContent value={TabsValue.Results}>
        <CreativeCashFlowResults hasAnimated={hasAnimated} />
      </TabsContent>
    </Tabs>
  );
}
