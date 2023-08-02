import { useSetAtom, useAtomValue } from 'jotai';
import { toast } from 'react-toastify';

import { simple_calculate } from '../functions/simple-calculate-debt';
import { snowball_calculate } from '../functions/snowball-calculate-debt';
import { debtsAtom, debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationSchemaType } from '../schema';

export const useDebtCalculate = () => {
  const debts = useAtomValue(debtsAtom) as Debt[];
  const setDebtCaluclationInputs = useSetAtom(debtCalculationInputsAtom);
  const setDebtCalculationResults = useSetAtom(debtCalculationResultsAtom);

  return async (data: DebtCalculationSchemaType) => {
    // Simulate loading by waiting 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const currentResults = simple_calculate(structuredClone(debts));
      const strategyResults = snowball_calculate(structuredClone(debts), {
        isWealthAccelerator: data.strategy.includes('Wealth Accelerator'),
        additional_payment: data.additional_payment,
        lump_amounts: data.lump_amounts,
      });

      setDebtCaluclationInputs(data);
      setDebtCalculationResults({
        currentResults,
        strategyResults,
      });
    } catch (error: any) {
      toast.error(
        <div className="flex flex-col gap-2">
          <span>
            <span className="font-bold">{error.cause}</span> has a prinicipal and interest rate that
            exceeds the payment amount.
          </span>
          <span>Go to Finance &gt; Debts and increase the monthly payment.</span>
        </div>
      );
    }
  };
};
