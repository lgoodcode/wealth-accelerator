import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import type { Debt } from '@/lib/types/debts';
import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import { snowballCalculation } from '../functions/debt-snowball';
import { simpleCalculate } from '../functions/simple-calculate';
import { Strategies } from '../strategies';
import type { DebtCalculationSchemaType } from '../schema';

export const useDebtCalculate = (debts: Debt[]) => {
  const setDebtCaluclationInputs = useSetAtom(debtCalculationInputsAtom);
  const setDebtCalculationResults = useSetAtom(debtCalculationResultsAtom);

  return async (data: DebtCalculationSchemaType) => {
    let sorted_debts: Debt[];

    if (
      data.strategy === Strategies.WealthAcceleratorLowestBalance ||
      data.strategy === Strategies.LowestBalance
    ) {
      sorted_debts = debts.sort((a, b) => a.amount - b.amount);
    } else if (
      data.strategy === Strategies.WealthAcceleratorHighestBalance ||
      data.strategy === Strategies.HighestBalance
    ) {
      sorted_debts = debts.sort((a, b) => b.amount - a.amount);
    } else if (
      data.strategy === Strategies.WealthAcceleratorHighestInterest ||
      data.strategy === Strategies.HighestInterest
    ) {
      sorted_debts = debts.sort((a, b) => b.interest - a.interest);
    } else if (
      data.strategy === Strategies.WealthAcceleratorLowestInterest ||
      data.strategy === Strategies.LowestInterest
    ) {
      sorted_debts = debts.sort((a, b) => a.interest - b.interest);
    } else {
      console.error('Invalid strategy', data.strategy);
      toast.error('Invalid strategy');
      return;
    }

    // Simulate loading by waiting 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const currentResults = simpleCalculate(debts, data.target_date);
      const strategyResults = snowballCalculation(
        data.monthly_payment,
        sorted_debts,
        data.target_date
      );

      setDebtCaluclationInputs(data);
      setDebtCalculationResults({
        currentResults,
        strategyResults,
      });

      console.log({
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
