import { ResultsCard } from './results-card';
import type {
  DebtCalculationInputs,
  DebtCalculationResults,
  DebtSnowballComparison,
} from '../types';

interface DebtSnowballResultsProps {
  totalDebt: number;
  inputs: DebtCalculationInputs | null;
  results: DebtCalculationResults | null;
  comparison: DebtSnowballComparison | null;
}

export function DebtSnowballResults({
  totalDebt,
  inputs,
  results,
  comparison,
}: DebtSnowballResultsProps) {
  if (!inputs || !results || !comparison) {
    return null;
  }

  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-8">
      <ResultsCard
        title="Current Strategy"
        monthly_payment={inputs.monthly_payment - (inputs?.additional_payment ?? 0)}
        totalDebt={totalDebt}
        data={results.currentResults}
        cost={comparison.current.cost}
        saved={comparison.current.saved}
        dateDiff={comparison.current.dateDiff}
        opportunity_rate={inputs.opportunity_rate}
        opportunity_cost={comparison.current.oppCost}
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
        cost={comparison.strategy.cost}
        saved={comparison.strategy.saved}
        dateDiff={comparison.strategy.dateDiff}
        opportunity_rate={inputs.opportunity_rate}
        opportunity_cost={comparison.strategy.oppCost}
        loan_payback={results.strategyResults.loan_payback}
        lump_amounts={inputs.lump_amounts}
      />
    </div>
  );
}
