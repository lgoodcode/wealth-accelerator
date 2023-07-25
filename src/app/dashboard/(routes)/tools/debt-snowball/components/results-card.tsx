import { format, addMonths } from 'date-fns';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DebtCalculation } from '../types';

interface ResultsCardProps {
  title: string;
  targetDate?: Date;
  data: DebtCalculation;
  cost: number;
  saved: number;
  dateDiff: number;
}

export function ResultsCard({ title, targetDate, data, cost, saved, dateDiff }: ResultsCardProps) {
  const TotalDifference = () => {
    return (
      <div className="flex flex-row justify-between">
        <span className="text-xl">Total Difference</span>
        {cost ? (
          <span className="text-xl font-medium text-destructive">{dollarFormatter(cost * -1)}</span>
        ) : (
          <span className="text-xl font-medium text-success">{dollarFormatter(saved)}</span>
        )}
      </div>
    );
  };

  const TimeDifference = () => {
    return (
      <div className="flex flex-row justify-between">
        <span className="text-xl">
          Time Difference <span className="text-muted-foreground">(months)</span>
        </span>
        {dateDiff > 0 ? (
          <span className="text-xl font-medium text-destructive">{dateDiff}</span>
        ) : (
          <span className="text-xl font-medium text-success">{dateDiff}</span>
        )}
      </div>
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row justify-between">
            <span className="text-xl">Target Date</span>
            <span className="text-xl font-medium">
              {targetDate ? format(targetDate, 'MMMM yyyy') : 'None'}
            </span>
          </div>
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
          <TotalDifference />
          <TimeDifference />
        </div>

        {/* Display a table of total interest and debt for each month */}
        <Table>
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Interest</TableHead>
              <TableHead className="text-center">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg text-center">
            {data.balance_tracking.map((_, yearIndex) =>
              data.balance_tracking[yearIndex].map((month, monthIndex) =>
                month === 0 ? null : (
                  <TableRow key={`${title}-${yearIndex * 12 + monthIndex + 1}`}>
                    <TableCell>
                      {format(addMonths(new Date(), yearIndex * 12 + monthIndex + 1), 'MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      {dollarFormatter(data.interest_tracking[yearIndex][monthIndex])}
                    </TableCell>
                    <TableCell>{dollarFormatter(month)}</TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
