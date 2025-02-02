'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import CountUp from 'react-countup';
import { MoveDown, MoveRight } from 'lucide-react';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createCountUpPropsFactory } from '../utils/create-count-up-props';
import { animationProps, countUpProps } from '../utils/animations';
import { resultsLabels } from '../labels';
import { ccfInputsAtom, ccfResultsAtom, hasActualWaaAtom, updateActualWaaAtom } from '../atoms';
import { Trends } from './trends';
import { CurrencyInput } from '@/components/ui/currency-input';

interface CreativeCashFlowResultsProps {
  hasAnimated: boolean;
}

export function CreativeCashFlowResults({ hasAnimated }: CreativeCashFlowResultsProps) {
  const inputs = useAtomValue(ccfInputsAtom);
  const results = useAtomValue(ccfResultsAtom);
  const setActualWaa = useSetAtom(updateActualWaaAtom);
  const [hasActualWaa, setHasActualWaa] = useAtom(hasActualWaaAtom);
  const createCountUpProps = createCountUpPropsFactory(!hasAnimated);

  if (!results) {
    return null;
  }

  if (hasActualWaa === null) {
    setHasActualWaa(results.actual_waa !== null);
  }

  return (
    <AnimatePresence initial={!hasAnimated}>
      <motion.div
        initial="initial"
        animate="animate"
        className="grid gap-6 w-fit mx-auto grid-cols-[auto_240px_64px_428px] lg:grid-cols-[0px_500px_64px_500px]"
        transition={{
          staggerChildren: 0.5,
        }}
      >
        <Trends createCountUpProps={createCountUpProps} />

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{resultsLabels.collections.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.collections.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.collections, countUpProps.item1.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{resultsLabels.business_overhead.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.business_overhead.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.business_overhead, countUpProps.item3.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{resultsLabels.lifestyle_expenses.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.lifestyle_expenses.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.lifestyle_expenses, countUpProps.item5.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-3 row-span-1 flex items-center"
          {...animationProps('x')}
        >
          <MoveRight className="w-16 h-16 mx-auto text-destructive" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1 row-start-5 flex items-center"
          {...animationProps('x')}
        >
          <Card className="flex flex-col flex-grow justify-between">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {resultsLabels.lifestyle_expenses_tax.title}
              </CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.lifestyle_expenses_tax.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.lifestyle_expenses_tax, countUpProps.item7.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div className="col-span-1 col-start-2 row-span-1" {...animationProps()}>
          <Card className="flex flex-col flex-grow justify-between">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {resultsLabels.business_profit_before_tax.title}
              </CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.business_profit_before_tax.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(
                  results.business_profit_before_tax,
                  countUpProps.item9.delay
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-3 row-span-1 flex items-center"
          {...animationProps('x')}
        >
          <MoveRight className="w-16 h-16 mx-auto text-destructive" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1 row-start-9 flex items-center"
          {...animationProps('x')}
        >
          <Card className="flex flex-col flex-grow justify-between">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                {resultsLabels.tax_on_business_profit.title}
              </CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.tax_on_business_profit.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.tax_account, countUpProps.item11.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="col-span-1 col-start-4 row-span-1" {...animationProps()}>
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div className="col-span-1 col-start-4 row-span-1" {...animationProps()}>
          <Card>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl">{resultsLabels.waa.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.waa.description(
                  format(new Date(inputs.start_date), 'LLL d, y') +
                    ' - ' +
                    format(new Date(inputs.end_date), 'LLL d, y')
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <span className="text-2xl">{dollarFormatter(results.waa)}</span>
            </CardContent>

            {hasActualWaa ? (
              <>
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-2xl">{resultsLabels.actual_waa.title}</CardTitle>
                  <CardDescription className="text-md">
                    {resultsLabels.actual_waa.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <span className="text-2xl">
                    {!!results.actual_waa ? dollarFormatter(results.actual_waa) : 'None'}
                  </span>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-2xl">{resultsLabels.input_waa.title}</CardTitle>
                  <CardDescription className="text-md">
                    {resultsLabels.input_waa.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <CurrencyInput
                    className="text-lg"
                    placeholder="$100,000"
                    value={results.actual_waa ?? ''}
                    onChange={setActualWaa}
                  />
                </CardContent>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
