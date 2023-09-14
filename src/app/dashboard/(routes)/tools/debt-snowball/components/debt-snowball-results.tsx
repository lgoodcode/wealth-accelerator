import { useAtomValue } from 'jotai';

import { compare_strategies } from '../functions/compare-strategies';
import { ResultsCard } from './results-card';
import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import type { DebtCalculationInputs, DebtCalculationResults } from '../types';

interface DebtSnowballResultsProps {
  totalDebt: number;
}

export function DebtSnowballResults({ totalDebt }: DebtSnowballResultsProps) {
  const inputs = useAtomValue(debtCalculationInputsAtom) as DebtCalculationInputs;
  const results = useAtomValue(debtCalculationResultsAtom) as DebtCalculationResults;
  const comparison = compare_strategies(inputs, results);

  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-8">
      <ResultsCard
        title="Current Strategy"
        monthly_payment={inputs.monthly_payment - (inputs?.additional_payment ?? 0)}
        totalDebt={totalDebt}
        data={results.currentResults}
        cost={comparison.currentCost}
        saved={comparison.currentSaved}
        dateDiff={comparison.currentDateDiff}
        opportunity_rate={inputs.opportunity_rate}
        opportunity_cost={comparison.currentOppCost}
        loan_payback={{
          total: 0,
          interest: 0,
          months: 0,
        }}
      />
      <ResultsCard
        title={inputs.strategy}
        monthly_payment={inputs.monthly_payment}
        totalDebt={totalDebt}
        data={results.strategyResults}
        cost={comparison.strategyCost}
        saved={comparison.strategySaved}
        dateDiff={comparison.strategyDateDiff}
        opportunity_rate={inputs.opportunity_rate}
        opportunity_cost={comparison.strategyOppCost}
        loan_payback={results.strategyResults.loan_payback}
        lump_amounts={inputs.lump_amounts}
      />
    </div>
  );
}
