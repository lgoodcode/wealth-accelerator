import { useAtomValue } from 'jotai';
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
import { debtCalculationInputsAtom, debtCalculationResultsAtom } from '../atoms';
import type {
  DebtCalculationInputs,
  DebtCalculationResults,
  SnowballDebtCalculation,
} from '../types';

interface PaymentScheduleHeadersProps {
  debtPayoffs: SnowballDebtCalculation['debt_payoffs'];
}

const PaymentScheduleHeaders = ({ debtPayoffs }: PaymentScheduleHeadersProps): JSX.Element => {
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
  data: SnowballDebtCalculation;
}

const PaymentScheduleHeadersLeft = ({ inputs, data }: PaymentScheduleHeadersLeftProps) => {
  return (
    <>
      {data.balance_tracking.map((_, yearIndex) =>
        data.balance_tracking[yearIndex].map((_, monthIndex) => (
          <TableRow key={`content-${yearIndex * 12 + monthIndex + 1}`}>
            <TableCell>
              {format(addMonths(new Date(), yearIndex * 12 + monthIndex + 1), 'MMM yyyy')}
            </TableCell>
            <TableCell>{dollarFormatter(data.snowball_tracking[yearIndex][monthIndex])}</TableCell>
            <TableCell>
              {dollarFormatter(
                // The additional monthly payment and lump sum amounts
                (inputs?.additional_payment ?? 0) +
                  (monthIndex === 0 ? inputs.lump_amounts[yearIndex] ?? 0 : 0)
              )}
            </TableCell>
          </TableRow>
        ))
      )}
    </>
  );
};

export function PaymentScheduleTable() {
  const inputs = useAtomValue(debtCalculationInputsAtom) as DebtCalculationInputs;
  const { strategyResults } = useAtomValue(debtCalculationResultsAtom) as DebtCalculationResults;

  return (
    <Card>
      <CardContent className="flex flex-row gap-0 p-0">
        <div className="w-fit h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Snowball</TableHead>
                <TableHead className="text-center">Additional</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center whitespace-nowrap">
              <PaymentScheduleHeadersLeft inputs={inputs} data={strategyResults} />
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
            {strategyResults.balance_tracking.map((_, yearIndex) =>
              strategyResults.balance_tracking[yearIndex].map((month, monthIndex) => (
                <TableRow key={`content-${yearIndex * 12 + monthIndex + 1}`}>
                  {strategyResults.debt_payoffs.map((debtPayoff) => (
                    <TableCell key={`${debtPayoff.debt.description}-${yearIndex}-${monthIndex}`}>
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
