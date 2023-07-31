'use client';

import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebtSnowballInputs } from './debt-snowball-inputs';
import { DebtSnowballResults } from './debt-snowball-results';
import { debtCalculationResultsAtom } from '../atoms';
import { debtsAtom } from '../../../finance/debts/atoms';
import type { Debt } from '@/lib/types/debts';

enum TabsValue {
  Inputs = 'inputs',
  Results = 'results',
}

interface DebtSnowballProps {
  debts: Debt[];
}

export function DebtSnowball({ debts }: DebtSnowballProps) {
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Inputs);
  const setDebts = useSetAtom(debtsAtom);
  const debtCalculationResults = useAtomValue(debtCalculationResultsAtom);
  const totalDebt = debts.reduce((a, b) => a + b.amount, 0);

  useEffect(() => {
    if (debtCalculationResults) {
      setActiveTab(TabsValue.Results);
    }
  }, [debtCalculationResults]);

  // If the debts page has not been visited, we use the data retrieved from the sever
  // Otherwise, we use the data from the debts page so that when any changes are made
  // it will be synced on the client-side for debt snowball and debts page
  useEffect(() => {
    setDebts((curr) => {
      if (!curr || curr !== debts) {
        return debts;
      }
      return curr;
    });
  }, [debts]);

  return (
    <Tabs
      className="w-full"
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value === TabsValue.Inputs ? value : TabsValue.Results)
      }
    >
      <TabsList className="grid w-[400px] mx-auto grid-cols-2 mb-8">
        <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger>
        <TabsTrigger value={TabsValue.Results} disabled={!debtCalculationResults}>
          Results
        </TabsTrigger>
      </TabsList>
      <TabsContent value={TabsValue.Inputs}>
        <DebtSnowballInputs debts={debts} />
      </TabsContent>
      <TabsContent value={TabsValue.Results}>
        <DebtSnowballResults totalDebt={totalDebt} />
      </TabsContent>
    </Tabs>
  );
}
