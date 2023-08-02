import { useAtomValue } from 'jotai';

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
        total_spillover={results.currentResults.total_spillover}
      />
      <ResultsCard
        title={inputs.strategy}
        monthly_payment={inputs.monthly_payment}
        totalDebt={totalDebt}
        data={results.strategyResults}
        cost={strategyCost}
        saved={strategySaved}
        dateDiff={strategyDateDiff}
        total_spillover={results.strategyResults.total_spillover}
        lump_amounts={inputs.lump_amounts}
      />
    </div>
  );
}
