'use client';

import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import CountUp from 'react-countup';
import { MoveDown, MoveRight } from 'lucide-react';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createCountUpPropsFactory } from '../utils/create-count-up-props';
import { animationProps, countUpProps } from '../utils/animations';
import { resultsLabels } from '../labels';
import { ccfResultsAtom } from '../atoms';
import { Trends } from './trends';
import { UpdateWaa } from './update-waa';

interface CreativeCashFlowResultsProps {
  hasAnimated: boolean;
}

export function CreativeCashFlowResults({ hasAnimated }: CreativeCashFlowResultsProps) {
  const results = useAtomValue(ccfResultsAtom);
  const originalWaaRef = useRef(results?.waa ?? 0);
  const originalTotalWaaRef = useRef((results?.total_waa ?? 0) - (results?.waa ?? 0));
  const createCountUpProps = createCountUpPropsFactory(!hasAnimated);

  if (!results) {
    return null;
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
              <CardDescription className="text-md">{resultsLabels.waa.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <span className="text-2xl">{dollarFormatter(originalWaaRef.current)}</span>
            </CardContent>

            <UpdateWaa originalTotalWaa={originalTotalWaaRef.current} />

            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl">{resultsLabels.total_waa.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.total_waa.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <span className="text-2xl">{dollarFormatter(results.total_waa)}</span>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
