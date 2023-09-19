'use client';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DebtsTable } from '@/components/debts-table';
import { DebtSnowballInputsForm } from './debt-snowball-inputs-form';
import { DebtSnowballInputsView } from './debt-snowball-inputs-view';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationInputs } from '../types';

interface DebtSnowballInputsProps {
  debts: Debt[];
  inputs?: DebtCalculationInputs;
}

export function DebtSnowballInputs({ debts, inputs }: DebtSnowballInputsProps) {
  const totalDebt = debts.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="relative flex flex-col lg:grid grid-cols-3 gap-8">
      <div className="col-span-1 sticky top-8 h-fit flex flex-col gap-6">
        {inputs ? (
          <>
            {/* @ts-ignore - the `id` and `user_id` is omitted but will still function as needed to display  */}
            <DebtSnowballInputsView debts={debts} inputs={inputs} />
          </>
        ) : (
          <DebtSnowballInputsForm debts={debts} />
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
