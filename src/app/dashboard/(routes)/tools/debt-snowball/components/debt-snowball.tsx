'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';

import { Loading } from '@/components/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SaveAndResetButtons } from './save-and-reset-buttons';
import { DebtSnowballInputs } from './debt-snowball-inputs';
import { DebtSnowballResults } from './debt-snowball-results';
import { PaymentScheduleTable } from './payment-schedule-table';
import {
  debtsAtom,
  debtCalculationInputsAtom,
  debtCalculationResultsAtom,
  debtSnowballComparisonAtom,
} from '../atoms';
import type { Debt } from '@/lib/types/debts';

enum TabsValue {
  Inputs = 'inputs',
  Results = 'results',
  PaymentSchedule = 'payment-schedule',
}

interface DebtSnowballProps {
  debtsData: Debt[];
  userId: string;
}

export function DebtSnowball({ debtsData, userId }: DebtSnowballProps) {
  const [inputs, setInputs] = useAtom(debtCalculationInputsAtom);
  const [results, setResults] = useAtom(debtCalculationResultsAtom);
  const [comparison, setComparison] = useAtom(debtSnowballComparisonAtom);
  const [debtCalculationResults, setDebtCalculationResults] = useAtom(debtCalculationResultsAtom);
  const [debts, setDebts] = useAtom(debtsAtom);
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Inputs);
  const totalDebt = debts?.reduce((a, b) => a + b.amount, 0) ?? 0;

  const handleReset = () => {
    setActiveTab(TabsValue.Inputs);
    setInputs(null);
    setResults(null);
    setComparison(null);
    setDebtCalculationResults(null);
  };

  useEffect(() => {
    if (!debtsData.length) {
      toast.error('You must have at least one debt entry to calculate');
      return;
    }
  }, []);

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
      if (!curr || curr !== debtsData) {
        return debtsData;
      }
      return curr;
    });
  }, [debtsData]);

  if (!debts) {
    return <Loading />;
  }

  return (
    <Tabs
      className="w-full"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabsValue)}
    >
      <div className="relative mb-8 flex flex-row justify-center items-center gap-2">
        <TabsList className="relative grid w-[480px] mx-auto grid-cols-3 mb-8">
          <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger>
          <TabsTrigger value={TabsValue.Results} disabled={!debtCalculationResults}>
            Results
          </TabsTrigger>
          <TabsTrigger value={TabsValue.PaymentSchedule} disabled={!debtCalculationResults}>
            Payment Schedule
          </TabsTrigger>
          <SaveAndResetButtons
            className="absolute left-[480px]"
            userId={userId}
            debts={debts}
            inputs={inputs}
            results={results}
            handleReset={handleReset}
          />
        </TabsList>
      </div>
      <TabsContent value={TabsValue.Inputs}>
        <DebtSnowballInputs debts={debts} />
      </TabsContent>
      <TabsContent value={TabsValue.Results}>
        <DebtSnowballResults
          totalDebt={totalDebt}
          inputs={inputs}
          results={results}
          comparison={comparison}
        />
      </TabsContent>
      <TabsContent value={TabsValue.PaymentSchedule}>
        <PaymentScheduleTable inputs={inputs} results={results} />
      </TabsContent>
    </Tabs>
  );
}
