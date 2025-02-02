import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { resultsLabels } from '../../labels';
import type { CreativeCashFlowRecord } from '../../types';

interface ResultsCardProps {
  record: CreativeCashFlowRecord;
}

export function ResultsCard({ record }: ResultsCardProps) {
  console.log({ record });
  return (
    <Card className="flex flex-col max-w-[500px] w-full min-w-[280px] h-fit">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 text-lg">
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.collections.title}</span>
            <span>{dollarFormatter(record.results.collections)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.business_overhead.title}</span>
            <span>{dollarFormatter(record.results.business_overhead)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.tax_on_business_profit.title}</span>
            <span>{dollarFormatter(record.results.tax_account)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.lifestyle_expenses.title}</span>
            <span>{dollarFormatter(record.results.lifestyle_expenses)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.lifestyle_expenses_tax.title}</span>
            <span>{dollarFormatter(record.results.lifestyle_expenses_tax)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.business_profit_before_tax.title}</span>
            <span>{dollarFormatter(record.results.business_profit_before_tax)}</span>
          </div>
          <div className="flex py-4 justify-between border-b font-bold">
            <span>{resultsLabels.waa.title}</span>
            <span>{dollarFormatter(record.results.waa)}</span>
          </div>
          <div className="flex py-4 justify-between border-b font-bold">
            <span>{resultsLabels.actual_waa.title}</span>
            <span>
              {!!record.results.actual_waa ? dollarFormatter(record.results.actual_waa) : 'None'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
