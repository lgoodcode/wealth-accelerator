import { format, addMonths } from 'date-fns';
import { Info } from 'lucide-react';

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
import type { SimpleDebtCalculation, SnowballDebtCalculation } from '../types';

interface ResultsCardProps {
  title: string;
  monthly_payment: number;
  totalDebt: number;
  data: SimpleDebtCalculation | SnowballDebtCalculation;
  cost: number;
  saved: number;
  dateDiff: number;
  opportunity_rate: number;
  opportunity_cost: number;
  lump_amounts?: number[];
}

interface InfoHoverCardProps {
  children: React.ReactNode;
}

const InfoHoverCard = ({ children }: InfoHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info className="ml-2 w-5 h-5 cursor-pointer" />
      </HoverCardTrigger>
      <HoverCardContent className="bg-accent">{children}</HoverCardContent>
    </HoverCard>
  );
};

export function ResultsCard({
  title,
  totalDebt,
  monthly_payment,
  data,
  cost,
  saved,
  dateDiff,
  opportunity_rate,
  opportunity_cost,
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
            <span className="text-xl">Monthly Debt Payment</span>
            <span className="text-xl font-medium">{dollarFormatter(monthly_payment)}</span>
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
                'text-destructive': loan_taken_out > 0,
              })}
            >
              {dollarFormatter(loan_taken_out)}
            </span>
          </div>
          <TotalDifference />
          <TimeDifference />
          <div className="flex flex-row justify-between">
            <span className="text-xl">Opportunity Cost Recovery Rate</span>
            <span className="text-xl font-medium">{opportunity_rate}%</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-xl">Opportunity Cost Recovery</span>
            <span
              className={cn('text-xl font-medium', {
                'text-success': opportunity_cost > 0,
              })}
            >
              {dollarFormatter(opportunity_cost)}
            </span>
          </div>
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
              data.balance_tracking[yearIndex].map((month, monthIndex) => (
                <TableRow key={`${title}-${yearIndex * 12 + monthIndex + 1}`}>
                  <TableCell>
                    {format(addMonths(new Date(), yearIndex * 12 + monthIndex + 1), 'MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    {dollarFormatter(data.interest_tracking[yearIndex][monthIndex])}
                  </TableCell>
                  <TableCell
                    className={cn({
                      'flex flex-row justify-center items-center':
                        (monthIndex === 0 && lump_amounts?.[yearIndex]) || month === 0,
                    })}
                  >
                    <span
                      className={cn({
                        'text-success': monthIndex === 0 && lump_amounts?.[yearIndex],
                      })}
                    >
                      {dollarFormatter(month)}
                    </span>

                    {monthIndex === 0 && lump_amounts?.[yearIndex] && (
                      <InfoHoverCard>
                        A lump amount of{' '}
                        <span className="font-bold">
                          {dollarFormatter(lump_amounts[yearIndex], {
                            maximumFractionDigits: 0,
                          })}
                        </span>{' '}
                        was applied for this month
                      </InfoHoverCard>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
