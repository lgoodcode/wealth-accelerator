'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebtSnowballInputs } from './debt-snowball-inputs';
import { DebtSnowballResults } from './debt-snowball-results';
import { debtCalculationResultsAtom } from '../atoms';
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
  const debtCalculationResults = useAtomValue(debtCalculationResultsAtom);

  useEffect(() => {
    if (debtCalculationResults) {
      setActiveTab(TabsValue.Results);
    }
  }, [debtCalculationResults]);

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
        <DebtSnowballResults />
      </TabsContent>
    </Tabs>
  );
}
