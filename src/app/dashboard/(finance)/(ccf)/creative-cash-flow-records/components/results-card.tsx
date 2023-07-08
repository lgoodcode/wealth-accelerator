import { resultsLabels } from '../../labels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreativeCashFlowRecord } from '../../types';

interface InputsCardProps {
  record: CreativeCashFlowRecord;
}

export function ResultsCard({ record }: InputsCardProps) {
  return (
    <Card className="flex flex-col max-w-[500px] w-full min-w-[280px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Results</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 text-lg">
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.business_profit_before_tax.title}</span>
            <span>${record.results.business_profit_before_tax}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.lifestyle_expenses.title}</span>
            <span>${record.results.lifestyle_expenses}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.lifestyle_expenses_tax.title}</span>
            <span>${record.results.lifestyle_expenses_tax}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.tax_on_business_profit.title}</span>
            <span>${record.results.tax_account}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.business_overhead.title}</span>
            <span>${record.results.business_overhead}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.waa.title}</span>
            <span>${record.results.waa}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.collections.title}</span>
            <span>${record.results.collections}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{resultsLabels.year_to_date.title}</span>
            <span>${record.results.year_to_date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
