import { useAtomValue } from 'jotai';

import { ResultsCard } from './results-card';
import { debtCalculationResultsAtom } from '../atoms';

export function DebtSnowballResults() {
  const results = useAtomValue(debtCalculationResultsAtom);

  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-8">
      <ResultsCard title="Current Strategy" data={results!.currentResults} />
      <ResultsCard title={results!.inputs.strategy} data={results!.strategyResults} />
    </div>
  );
}
