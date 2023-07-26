'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebtsTable } from '@/components/debts-table';
import { DebtSnowballInputsForm } from './debt-snowball-inputs-form';
import type { Debt } from '@/lib/types/debts';

interface DebtSnowballInputsContainerProps {
  debts: Debt[];
}

export function DebtSnowballInputs({ debts }: DebtSnowballInputsContainerProps) {
  const paymentsSum = debts.reduce((acc, debt) => acc + debt.payment, 0);

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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Debts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <DebtsTable
              debts={debts}
              rowActions={false}
              enableHeaderOptions={false}
              toolbar={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
