import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import { debtCalculationResultsAtom } from '../atoms';
import { snowballCalculation } from '../functions/debt-snowball';
import { simpleCalculate } from '../functions/simple-calculate';
import { Strategies } from '../strategies';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationSchemaType } from '../schema';

export const useDebtCalculate = (debts: Debt[]) => {
  const setDebtCalculation = useSetAtom(debtCalculationResultsAtom);

  return (data: DebtCalculationSchemaType) => {
    let sorted_debts: Debt[];

    if (data.strategy === Strategies.DebtSnowball || data.strategy === Strategies.LowestBalance) {
      sorted_debts = debts.sort((a, b) => a.amount - b.amount);
    } else if (data.strategy === Strategies.HighestBalance) {
      sorted_debts = debts.sort((a, b) => b.amount - a.amount);
    } else if (data.strategy === Strategies.HighestInterest) {
      sorted_debts = debts.sort((a, b) => b.interest - a.interest);
    } else if (data.strategy === Strategies.LowestInterest) {
      sorted_debts = debts.sort((a, b) => a.interest - b.interest);
    } else {
      console.error('Invalid strategy', data.strategy);
      toast.error('Invalid strategy');
      return;
    }

    try {
      const currentResults = simpleCalculate(debts, data.target_date);
      const strategyResults = snowballCalculation(data.snowball, sorted_debts, data.target_date);

      setDebtCalculation({
        inputs: data,
        currentResults,
        strategyResults,
      });

      console.log({ currentResults, strategyResults });
    } catch (error: any) {
      toast.error(
        <span>
          <span className="font-bold">{error.cause}</span> has a prinicipal and interest rate that
          exceeds the payment amount.
        </span>
      );
    }
  };
};
