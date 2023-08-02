import { useAtomValue } from 'jotai';

import { moneyRound } from '@/lib/utils/money-round';
import { ResultsCard } from './results-card';
import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import type { DebtCalculationInputs, DebtCalculationResults } from '../types';

interface DebtSnowballResultsProps {
  totalDebt: number;
}

export function DebtSnowballResults({ totalDebt }: DebtSnowballResultsProps) {
  const inputs = useAtomValue(debtCalculationInputsAtom) as DebtCalculationInputs;
  const results = useAtomValue(debtCalculationResultsAtom) as DebtCalculationResults;
  const diff_in_months =
    results.currentResults.payoff_months - results.strategyResults.payoff_months;
  let currentSaved = 0;
  let currentCost = 0;
  let strategySaved = 0;
  let strategyCost = 0;
  let currentDateDiff = 0;
  let strategyDateDiff = 0;
  let currentOppCost = 0;
  let strategyOppCost = 0;

  if (results.currentResults.total_amount < results.strategyResults.total_amount) {
    const val = results.strategyResults.total_amount - results.currentResults.total_amount;
    currentSaved = strategyCost = val;
    currentDateDiff = -diff_in_months;
    strategyDateDiff = diff_in_months;
  } else if (results.currentResults.total_amount > results.strategyResults.total_amount) {
    const val = results.currentResults.total_amount - results.strategyResults.total_amount;
    currentCost = strategySaved = val;
    currentDateDiff = diff_in_months;
    strategyDateDiff = -diff_in_months;
  } else {
    currentSaved = strategySaved = 0;
    currentCost = strategyCost = 0;
    currentDateDiff = strategyDateDiff = 0;
  }

  // If there is an opportunity cost rate set, calculate compound interest by taking the monthly
  // payment and multiplying it by the opportunity rate for difference in months between the
  // two strategies. Otherwise, set the opportunity cost to 0.
  if (inputs.opportunity_rate > 0) {
    const opportunity_rate = inputs.opportunity_rate / 100 / 12;

    if (results.currentResults.total_amount < results.strategyResults.total_amount) {
      for (let i = 0; i < diff_in_months; i++) {
        if (i === 0) {
          currentOppCost =
            inputs.monthly_payment + moneyRound(inputs.monthly_payment * opportunity_rate);
        } else {
          const interest = moneyRound(currentOppCost * opportunity_rate);
          currentOppCost += inputs.monthly_payment + interest;
        }
      }
    } else {
      for (let i = 0; i < diff_in_months; i++) {
        if (i === 0) {
          strategyOppCost =
            inputs.monthly_payment + moneyRound(inputs.monthly_payment * opportunity_rate);
        } else {
          const interest = moneyRound(strategyOppCost * opportunity_rate);
          strategyOppCost += inputs.monthly_payment + interest;
        }
      }
    }
    // Otherwise, just multiply the monthly payment by the difference in months
  } else {
    if (results.currentResults.total_amount < results.strategyResults.total_amount) {
      currentOppCost = inputs.monthly_payment * diff_in_months;
    } else {
      strategyOppCost = inputs.monthly_payment * diff_in_months;
    }
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-8">
      <ResultsCard
        totalDebt={totalDebt}
        title="Current Strategy"
        monthly_payment={inputs.monthly_payment - (inputs?.additional_payment ?? 0)}
        data={results.currentResults}
        cost={currentCost}
        saved={currentSaved}
        dateDiff={currentDateDiff}
        opportunity_rate={inputs.opportunity_rate}
        opportunity_cost={currentOppCost}
        total_snowball={0}
      />
      <ResultsCard
        title={inputs.strategy}
        monthly_payment={inputs.monthly_payment}
        totalDebt={totalDebt}
        data={results.strategyResults}
        cost={strategyCost}
        saved={strategySaved}
        dateDiff={strategyDateDiff}
        opportunity_rate={inputs.opportunity_rate}
        opportunity_cost={strategyOppCost}
        total_snowball={results.strategyResults.total_snowball}
        lump_amounts={inputs.lump_amounts}
      />
    </div>
  );
}
