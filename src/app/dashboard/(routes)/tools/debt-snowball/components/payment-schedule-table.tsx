import { format, addMonths } from 'date-fns';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import type {
  DebtCalculationInputs,
  DebtCalculationResults,
  SnowballDebtCalculation,
} from '../types';
import { captureMessage } from '@sentry/nextjs';

interface PaymentScheduleHeadersProps {
  debtPayoffs: SnowballDebtCalculation['debt_payoffs'];
}

const PaymentScheduleHeaders = ({ debtPayoffs }: PaymentScheduleHeadersProps) => {
  return (
    <>
      {debtPayoffs.map((debtPayoff, index) => (
        <TableHead key={index} className="text-center w-fit whitespace-nowrap">
          {debtPayoff.debt.description}
        </TableHead>
      ))}
    </>
  );
};

interface PaymentScheduleHeadersLeftProps {
  inputs: DebtCalculationInputs;
  results: SnowballDebtCalculation;
  years: number[][];
}

const PaymentScheduleHeadersLeft = ({
  inputs,
  results,
  years,
}: PaymentScheduleHeadersLeftProps) => {
  return (
    <>
      {years.map((_, yearIndex) =>
        years[yearIndex].map((_, monthIndex) => (
          <TableRow key={`content-${yearIndex * 12 + monthIndex + 1}`}>
            <TableCell>
              {format(addMonths(new Date(), yearIndex * 12 + monthIndex + 1), 'MMM yyyy')}
            </TableCell>
            <TableCell>
              {dollarFormatter(
                results.snowball_tracking[yearIndex] &&
                  results.snowball_tracking[yearIndex][monthIndex]
                  ? results.snowball_tracking[yearIndex][monthIndex]
                  : inputs.monthly_payment
              )}
            </TableCell>
            {inputs.pay_back_loan && (
              <TableCell>
                {results.loan_payback.tracking[yearIndex][monthIndex]
                  ? dollarFormatter(results.loan_payback.tracking[yearIndex][monthIndex])
                  : '-'}
              </TableCell>
            )}
          </TableRow>
        ))
      )}
    </>
  );
};

interface PaymentScheduleTableProps {
  inputs: DebtCalculationInputs | null;
  results: DebtCalculationResults | null;
}

export function PaymentScheduleTable({ inputs, results }: PaymentScheduleTableProps) {
  if (!inputs || !results) {
    return null;
  }

  const { strategy: strategyResults } = results;
  const numYears = Math.max(
    strategyResults.balance_tracking.length,
    strategyResults.loan_payback.tracking.length
  );

  let lastMonth = 0;

  try {
    lastMonth = Math.max(
      strategyResults.balance_tracking[numYears - 1].length,
      strategyResults.loan_payback.tracking[numYears - 1].length
    );
  } catch (e) {
    console.log({ inputs, results, strategyResults, numYears });

    lastMonth = Math.max(
      strategyResults.balance_tracking[numYears - 2].length,
      strategyResults.loan_payback.tracking[numYears - 2].length
    );
  }

  const years = Array.from({ length: numYears }, (_, i) =>
    Array.from({ length: i === numYears - 1 ? lastMonth : 12 }, (_, j) => j)
  );

  return (
    <Card>
      <CardContent className="flex flex-row gap-0 p-0">
        <div className="w-fit h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Snowball</TableHead>
                {inputs.pay_back_loan && <TableHead className="text-center">Loan</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody className="text-center whitespace-nowrap">
              <PaymentScheduleHeadersLeft inputs={inputs} results={strategyResults} years={years} />
            </TableBody>
          </Table>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <PaymentScheduleHeaders debtPayoffs={strategyResults.debt_payoffs} />
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {years.map((_, yearIndex) =>
              years[yearIndex].map((_, monthIndex) => (
                <TableRow key={`content-${yearIndex * 12 + monthIndex + 1}`}>
                  {strategyResults.debt_payoffs.map((debtPayoff, i) => (
                    <TableCell
                      key={`${debtPayoff.debt.description}-${yearIndex}-${monthIndex}-${i}`}
                    >
                      {debtPayoff.payment_tracking[yearIndex][monthIndex]
                        ? dollarFormatter(debtPayoff.payment_tracking[yearIndex][monthIndex])
                        : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
