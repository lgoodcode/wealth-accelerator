'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { compare_strategies } from '../../functions/compare-strategies';
import { DebtSnowballMenu } from '../components/debt-snowball-menu';
import { DebtSnowballResults } from '../../components/debt-snowball-results';
import { PaymentScheduleTable } from '../../components/payment-schedule-table';
import type { DebtSnowballRecord } from '../../types';

enum TabsValue {
  // Inputs = 'inputs',
  Results = 'results',
  PaymentSchedule = 'payment-schedule',
}

interface DebtSnowballRecordProps {
  record: DebtSnowballRecord;
}

export function DebtSnowballRecordView({ record }: DebtSnowballRecordProps) {
  const comparison = compare_strategies(record.inputs, record.results);
  // const [debts, setDebts] = useAtom(debtsAtom);
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Results);
  const totalDebt = record.debts.reduce((a, b) => a + b.amount, 0) ?? 0;

  return (
    <Tabs
      className="w-full"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabsValue)}
    >
      <div className="relative mb-8 flex flex-row justify-center items-center gap-2">
        <TabsList className="relative grid w-[360px] grid-cols-2">
          {/* <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger> */}
          <TabsTrigger value={TabsValue.Results}>Results</TabsTrigger>
          <TabsTrigger value={TabsValue.PaymentSchedule}>Payment Schedule</TabsTrigger>
        </TabsList>
        <DebtSnowballMenu className="aboslute left-[360px]" record={record} redirectOnDelete />
      </div>
      {/* <TabsContent value={TabsValue.Inputs}>
        <DebtSnowballInputs debts={debts!} />
      </TabsContent> */}
      <TabsContent value={TabsValue.Results}>
        <DebtSnowballResults
          totalDebt={totalDebt}
          inputs={record.inputs}
          results={record.results}
          comparison={comparison}
        />
      </TabsContent>
      <TabsContent value={TabsValue.PaymentSchedule}>
        <PaymentScheduleTable inputs={record.inputs} results={record.results} />
      </TabsContent>
    </Tabs>
  );
}
