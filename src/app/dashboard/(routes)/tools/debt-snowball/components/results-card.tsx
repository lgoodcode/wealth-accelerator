import { format, addMonths } from 'date-fns';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DebtCalculation } from '../types';

import { useState } from 'react';

interface ResultsCardProps {
  title: string;
  data: DebtCalculation;
}

export function ResultsCard({ title, data }: ResultsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="h-fit">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row justify-between">
            <span className="text-xl">Total Interest Paid</span>
            <span className="text-xl font-medium">{dollarFormatter(data.total_interest)}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-xl">Total Paid</span>
            <span className="text-xl font-medium">{dollarFormatter(data.total_amount)}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-xl">Total Months</span>
            <span className="text-xl font-medium">{data.payoff_months}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-xl">Projected Payoff Date</span>
            <span className="text-xl font-medium">
              {format(addMonths(new Date(), data.payoff_months), 'MMMM yyyy')}
            </span>
          </div>
        </div>
        <div></div>
      </CardContent>
    </Card>
  );
}
