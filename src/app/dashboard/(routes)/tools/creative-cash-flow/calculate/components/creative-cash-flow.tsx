'use client';

import { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creativeCashFlowResultAtom, resetCreativeCashFlowInputsAtom } from '../../atoms';
import { Buttons } from './buttons';
import { CreativeCashFlowInputs } from './creative-cash-flow-inputs';
import { CreativeCashFlowResults } from './creative-cash-flow-results';
import type { Transaction } from '@/lib/plaid/types/transactions';

enum TabsValue {
  Inputs = 'inputs',
  Results = 'results',
}

interface CcfContainerProps {
  userId: string;
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
  ytd_collections: number;
  default_tax_rate: number;
}

export function CreativeCashFlow({
  userId,
  transactions,
  ytd_collections,
  default_tax_rate,
}: CcfContainerProps) {
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Inputs);
  const [results, setResults] = useAtom(creativeCashFlowResultAtom);
  const resetCreativeCashFlowInput = useSetAtom(resetCreativeCashFlowInputsAtom);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleReset = () => {
    setActiveTab(TabsValue.Inputs);
    setResults(null);
    resetCreativeCashFlowInput();
    setHasAnimated(false);
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

  return (
    <Tabs className="w-full" value={activeTab} onValueChange={onTabChange}>
      <div className="relative mb-8 flex flex-row justify-center items-center gap-2">
        <TabsList className="relative grid w-[360px] grid-cols-2">
          <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger>
          <TabsTrigger value={TabsValue.Results} disabled={!results}>
            Results
          </TabsTrigger>
          <Buttons className="absolute left-[360px]" userId={userId} handleReset={handleReset} />
        </TabsList>
      </div>
      <TabsContent value={TabsValue.Inputs}>
        <CreativeCashFlowInputs
          userId={userId}
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
