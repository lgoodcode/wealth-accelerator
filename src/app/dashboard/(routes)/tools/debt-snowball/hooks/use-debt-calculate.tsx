import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import { calculate_debt } from '../functions/calculate-debt';
import { Strategies } from '../strategies';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationSchemaType } from '../schema';

export const useDebtCalculate = (debts: Debt[]) => {
  const setDebtCaluclationInputs = useSetAtom(debtCalculationInputsAtom);
  const setDebtCalculationResults = useSetAtom(debtCalculationResultsAtom);

  return async (data: DebtCalculationSchemaType) => {
    const regular_debts = structuredClone(debts);
    const sorted_debts = structuredClone(debts);

    if (
      data.strategy === Strategies.WealthAcceleratorLowestBalance ||
      data.strategy === Strategies.LowestBalance
    ) {
      sorted_debts.sort((a, b) => a.amount - b.amount);
    } else if (
      data.strategy === Strategies.WealthAcceleratorHighestBalance ||
      data.strategy === Strategies.HighestBalance
    ) {
      sorted_debts.sort((a, b) => b.amount - a.amount);
    } else if (
      data.strategy === Strategies.WealthAcceleratorHighestInterest ||
      data.strategy === Strategies.HighestInterest
    ) {
      sorted_debts.sort((a, b) => b.interest - a.interest);
    } else if (
      data.strategy === Strategies.WealthAcceleratorLowestInterest ||
      data.strategy === Strategies.LowestInterest
    ) {
      sorted_debts.sort((a, b) => a.interest - b.interest);
    } else {
      console.error('Invalid strategy', data.strategy);
      toast.error('Invalid strategy');
      return;
    }

    // Simulate loading by waiting 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const currentResults = calculate_debt(regular_debts, {
        target_date: data.target_date,
      });
      const strategyResults = calculate_debt(sorted_debts, {
        isDebtSnowball: true,
        isWealthAccelerator: data.strategy.includes('Wealth Accelerator'),
        additional_payment: data.additional_payment,
        target_date: data.target_date,
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
