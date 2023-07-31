import { format, addMonths } from 'date-fns';

import { cn } from '@/lib/utils/cn';
import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { formatMonths } from '@/lib/utils/format-months';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DebtCalculation } from '../types';
import { Info } from 'lucide-react';

interface ResultsCardProps {
  title: string;
  targetDate?: Date;
  totalDebt: number;
  data: DebtCalculation;
  cost: number;
  saved: number;
  dateDiff: number;
  lump_amounts?: number[];
}

export function ResultsCard({
  title,
  targetDate,
  totalDebt,
  data,
  cost,
  saved,
  dateDiff,
  lump_amounts,
}: ResultsCardProps) {
  const loan_taken_out = lump_amounts?.reduce((a, b) => a + b, 0) ?? 0;

  const TotalDifference = () => {
    return (
      <div className="flex flex-row justify-between">
        <span className="text-xl">Total Amount Difference</span>
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
        <span className="text-xl">Time Difference</span>
        {dateDiff > 0 ? (
          <span className="text-xl font-medium text-destructive">{formatMonths(dateDiff)}</span>
        ) : (
          <span className="text-xl font-medium text-success">
            {formatMonths(Math.abs(dateDiff))}
          </span>
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
            <span className="text-xl">Total Debt</span>
            <span className="text-xl font-medium">{dollarFormatter(totalDebt)}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-xl">Total Interest Paid</span>
            <span className="text-xl font-medium">{dollarFormatter(data.total_interest)}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-xl">Total Amount Paid</span>
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
          <div className="flex flex-row justify-between">
            <span className="text-xl">Loan Taken Out</span>
            <span
              className={cn('text-xl font-medium', {
                'text-success': loan_taken_out > 0,
                'text-destructive': loan_taken_out < 0,
              })}
            >
              {dollarFormatter(loan_taken_out)}
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
                // Don't render the last month when the debt is paid off
                month === 0 ? null : (
                  <TableRow key={`${title}-${yearIndex * 12 + monthIndex + 1}`}>
                    <TableCell>
                      {format(addMonths(new Date(), yearIndex * 12 + monthIndex + 1), 'MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      {dollarFormatter(data.interest_tracking[yearIndex][monthIndex])}
                    </TableCell>
                    {/* Render a different cell for when a lump sum is used */}
                    {monthIndex === 0 && lump_amounts?.[yearIndex] ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <TableCell className="flex flex-row justify-center items-center">
                            <span className="text-success">{dollarFormatter(month)}</span>
                            <Info className="ml-2 w-5 h-5" />
                          </TableCell>
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-accent">
                          A lump amount of{' '}
                          <span className="font-bold">
                            {dollarFormatter(lump_amounts[yearIndex], {
                              maximumFractionDigits: 0,
                            })}
                          </span>{' '}
                          was applied for this month
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <TableCell>{dollarFormatter(month)}</TableCell>
                    )}
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
