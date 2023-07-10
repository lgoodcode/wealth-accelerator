import { format } from 'date-fns';

import { dollarFormatter } from '@/lib/utils/dollarFormatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { inputLabels } from '../../labels';
import type { CreativeCashFlowRecord } from '../../types';

interface ResultsCardProps {
  record: CreativeCashFlowRecord;
}

export function InputsCard({ record }: ResultsCardProps) {
  return (
    <Card className="flex flex-col max-w-[500px] w-full min-w-[280px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Inputs</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 text-lg">
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.start_date.title}</span>
            <span>{format(new Date(record.inputs.start_date), 'LLL dd, y')}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.end_date.title}</span>
            <span>{format(new Date(record.inputs.end_date), 'LLL dd, y')}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.all_other_income.title}</span>
            <span>{dollarFormatter(record.inputs.all_other_income)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.payroll_and_distributions.title}</span>
            <span>{dollarFormatter(record.inputs.payroll_and_distributions)}</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.lifestyle_expenses_tax_rate.title}</span>
            <span>{record.inputs.lifestyle_expenses_tax_rate}%</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.tax_account_rate.title}</span>
            <span>{record.inputs.tax_account_rate}%</span>
          </div>
          <div className="flex py-4 justify-between border-b">
            <span>{inputLabels.optimal_savings_strategy.title}</span>
            <span>{dollarFormatter(record.inputs.optimal_savings_strategy)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
