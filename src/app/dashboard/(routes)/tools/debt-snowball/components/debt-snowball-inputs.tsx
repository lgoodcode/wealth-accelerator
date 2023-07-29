'use client';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebtsTable } from '@/components/debts-table';
import { DebtSnowballInputsForm } from './debt-snowball-inputs-form';
import type { Debt } from '@/lib/types/debts';

interface DebtSnowballInputsContainerProps {
  debts: Debt[];
}

export function DebtSnowballInputs({ debts }: DebtSnowballInputsContainerProps) {
  const paymentsSum = debts.reduce((acc, debt) => acc + debt.payment, 0);
  const totalDebt = debts.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="flex flex-col lg:grid grid-cols-3 gap-8">
      <div className="col-span-1">
        <Card className="col-span-1">
          <CardContent className="pt-6">
            <DebtSnowballInputsForm paymentsSum={paymentsSum} debts={debts} />
          </CardContent>
        </Card>
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
