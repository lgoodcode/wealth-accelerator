import { useSetAtom, useAtomValue } from 'jotai';
import { toast } from 'react-toastify';

import { simple_calculate } from '../functions/simple-calculate-debt';
import { snowball_calculate } from '../functions/snowball-calculate-debt';
import { compare_strategies } from '../functions/compare-strategies';
import {
  debtsAtom,
  debtCalculationInputsAtom,
  debtCalculationResultsAtom,
  debtSnowballComparisonAtom,
} from '../atoms';
import type { Debt } from '@/lib/types/debts';
import type { DebtCalculationSchema } from '../schema';

export const useSnowballCalculate = () => {
  const debts = useAtomValue(debtsAtom) as Debt[];
  const setDebtCaluclationInputs = useSetAtom(debtCalculationInputsAtom);
  const setDebtCalculationResults = useSetAtom(debtCalculationResultsAtom);
  const setDebtSnowballComparison = useSetAtom(debtSnowballComparisonAtom);

  return async (data: DebtCalculationSchema) => {
    if (!debts.length) {
      toast.error('You must have at least one debt entry to calculate');
      return;
    }

    // Simulate loading by waiting 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const currentResults = simple_calculate(structuredClone(debts));
      const strategyResults = snowball_calculate(structuredClone(debts), {
        isWealthAccelerator: data.strategy.includes('Wealth Accelerator'),
        additional_payment: data.additional_payment ?? 0,
        lump_amounts: data.lump_amounts,
        pay_back_loan: data.pay_back_loan,
        pay_interest: data.pay_interest,
        loan_interest_rate: data.loan_interest_rate,
      });
      const inputs = {
        ...data,
        additional_payment: data.additional_payment ?? 0,
      };
      const results = {
        current: currentResults,
        strategy: strategyResults,
      };

      setDebtCaluclationInputs(inputs);
      setDebtCalculationResults(results);
      setDebtSnowballComparison(compare_strategies(inputs, results));
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
