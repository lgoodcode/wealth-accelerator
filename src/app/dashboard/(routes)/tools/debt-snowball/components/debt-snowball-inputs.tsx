'use client';

import { useAtomValue } from 'jotai';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebtsTable } from '@/components/debts-table';
import { DebtSnowballInputsForm } from './debt-snowball-inputs-form';
import { DebtSnowballWealthAcceleratorForm } from './debt-snowball-wa-form';
import { strategyAtom } from '../atoms';
import type { Debt } from '@/lib/types/debts';

interface DebtSnowballInputsContainerProps {
  debts: Debt[];
}

export function DebtSnowballInputs({ debts }: DebtSnowballInputsContainerProps) {
  const strategy = useAtomValue(strategyAtom);
  const totalDebt = debts.reduce((a, b) => a + b.amount, 0);
  const shouldDisplayWealthAccelerator = strategy?.includes('Wealth Accelerator');

  return (
    <div className="flex flex-col lg:grid grid-cols-3 gap-8">
      <div className="col-span-1 flex flex-col gap-6">
        <Card>
          <CardContent className="pt-6">
            <DebtSnowballInputsForm debts={debts} />
            <DebtSnowballWealthAcceleratorForm />
          </CardContent>
        </Card>
        {shouldDisplayWealthAccelerator && (
          <Card>
            <CardContent className="pt-6">
              <DebtSnowballWealthAcceleratorForm />
            </CardContent>
          </Card>
        )}
      </div>
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex flex-row justify-between">
              <span>Debts</span>
              <span className="text-2xl">
                Total Debt: <span>{dollarFormatter(totalDebt)}</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <DebtsTable
              debts={debts}
              rowActions={false}
              enableHeaderOptions={false}
              toolbar={false}
              pagination={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
