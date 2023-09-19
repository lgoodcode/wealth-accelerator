'use client';

import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { compare_strategies } from '../../functions/compare-strategies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebtSnowballInputs } from '../../components/debt-snowball-inputs';
import { DebtSnowballResults } from '../../components/debt-snowball-results';
import { PaymentScheduleTable } from '../../components/payment-schedule-table';
import { DebtSnowballMenu } from '../components/debt-snowball-menu';
import { debtSnowballRecordsAtom } from '../../atoms';
import type { DebtSnowballRecord } from '../../types';

enum TabsValue {
  Inputs = 'inputs',
  Results = 'results',
  PaymentSchedule = 'payment-schedule',
}

interface DebtSnowballRecordProps {
  record: DebtSnowballRecord;
}

export function DebtSnowballRecordId({ record }: DebtSnowballRecordProps) {
  const comparison = compare_strategies(record.inputs, record.results);
  const setRecords = useSetAtom(debtSnowballRecordsAtom);
  const [activeTab, setActiveTab] = useState<TabsValue>(TabsValue.Results);
  const totalDebt = record.debts.reduce((acc, b) => acc + b.amount, 0) ?? 0;

  useEffect(() => {
    setRecords([record]);
  }, []);

  return (
    <Tabs
      className="w-full"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabsValue)}
    >
      <div className="relative mb-8 flex flex-row justify-center items-center gap-2">
        <TabsList className="relative grid w-[480px] grid-cols-3">
          <TabsTrigger value={TabsValue.Inputs}>Inputs</TabsTrigger>
          <TabsTrigger value={TabsValue.Results}>Results</TabsTrigger>
          <TabsTrigger value={TabsValue.PaymentSchedule}>Payment Schedule</TabsTrigger>
        </TabsList>
        <DebtSnowballMenu record={record} redirectOnDelete />
      </div>
      <TabsContent value={TabsValue.Inputs}>
        {/* @ts-ignore - the `id` and `user_id` is omitted but will still function as needed to display  */}
        <DebtSnowballInputs debts={record.debts} inputs={record.inputs} />
      </TabsContent>
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
