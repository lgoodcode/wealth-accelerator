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
import type { DebtCalculation, DebtCalculationInputs, DebtCalculationResults } from '../types';

interface BreakdownHeadersProps {
  debtPayoffs: DebtCalculation['debt_payoffs'];
}

const BreakdownHeaders = ({ debtPayoffs }: BreakdownHeadersProps): JSX.Element => {
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

interface BreakdownContentLeftProps {
  inputs: DebtCalculationInputs;
  data: DebtCalculation;
}

const BreakdownContentLeft = ({ inputs, data }: BreakdownContentLeftProps) => {
  return (
    <>
      {data.balance_tracking.map((_, yearIndex) =>
        data.balance_tracking[yearIndex].map((month, monthIndex) => (
          <TableRow key={`content-${yearIndex * 12 + monthIndex + 1}`}>
            <TableCell>
              {format(addMonths(new Date(), yearIndex * 12 + monthIndex + 1), 'MMM yyyy')}
            </TableCell>
            <TableCell>{dollarFormatter(data.spillover_tracking[yearIndex][monthIndex])}</TableCell>
            <TableCell>{dollarFormatter(inputs?.additional_payment ?? 0)}</TableCell>
          </TableRow>
        ))
      )}
    </>
  );
};

export function BreakdownTable() {
  const inputs = useAtomValue(debtCalculationInputsAtom) as DebtCalculationInputs;
  const { strategyResults } = useAtomValue(debtCalculationResultsAtom) as DebtCalculationResults;

  return (
    <Card>
      <CardContent className="flex flex-row gap-0 p-0">
        <div className="w-fit">
          <Table>
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Snowball</TableHead>
                <TableHead className="text-center">Additional</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-lg text-center whitespace-nowrap">
              <BreakdownContentLeft inputs={inputs} data={strategyResults} />
            </TableBody>
          </Table>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="text-lg">
              <BreakdownHeaders debtPayoffs={strategyResults.debt_payoffs} />
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg text-center">
            {strategyResults.balance_tracking.map((_, yearIndex) =>
              strategyResults.balance_tracking[yearIndex].map((month, monthIndex) => (
                <TableRow key={`content-${yearIndex * 12 + monthIndex + 1}`}>
                  {strategyResults.debt_payoffs.map((debtPayoff, index) => (
                    <TableCell key={`${debtPayoff.debt.description}-${yearIndex}-${monthIndex}`}>
                      {strategyResults.debt_payoffs[index].payment_tracking[yearIndex][monthIndex]
                        ? dollarFormatter(
                            strategyResults.debt_payoffs[index].payment_tracking[yearIndex][
                              monthIndex
                            ]
                          )
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
