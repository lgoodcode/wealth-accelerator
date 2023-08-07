'use client';

import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import CountUp from 'react-countup';
import { MoveDown, MoveRight } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createCountUpProps } from '../../utils/create-count-up-props';
import { animationProps, animationDurations } from '../../utils/animations';
import { resultsLabels } from '../../labels';
import { creativeCashFlowResultAtom } from '../../atoms';
import { Trends } from './trends';

export function CreativeCashFlowResults() {
  const results = useAtomValue(creativeCashFlowResultAtom);

  if (!results) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="grid gap-6 w-fit mx-auto grid-cols-[auto_320px_64px_320px] lg:grid-cols-[0px_480px_64px_480px]">
        <Trends />
        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item1 }}
          {...animationProps}
        >
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
                {...createCountUpProps(results.collections, animationDurations.item1.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item2 }}
          {...animationProps}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item3 }}
          {...animationProps}
        >
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
                {...createCountUpProps(results.business_overhead, animationDurations.item3.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item4 }}
          {...animationProps}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item5 }}
          {...animationProps}
        >
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
                {...createCountUpProps(results.lifestyle_expenses, animationDurations.item5.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-3 row-span-1 flex items-center"
          transition={{ ...animationDurations.item6 }}
          {...animationProps}
        >
          <MoveRight className="w-16 h-16 mx-auto text-destructive" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1 row-start-5 flex items-center"
          transition={{ ...animationDurations.item7 }}
          {...animationProps}
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
                {...createCountUpProps(
                  results.lifestyle_expenses_tax,
                  animationDurations.item7.delay
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item8 }}
          {...animationProps}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...animationDurations.item9 }}
          {...animationProps}
        >
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
                  animationDurations.item9.delay
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-3 row-span-1 flex items-center"
          transition={{ ...animationDurations.item10 }}
          {...animationProps}
        >
          <MoveRight className="w-16 h-16 mx-auto text-destructive" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1 row-start-9 flex items-center"
          transition={{ ...animationDurations.item11 }}
          {...animationProps}
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
                {...createCountUpProps(results.tax_account, animationDurations.item11.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1"
          transition={{ ...animationDurations.item12 }}
          {...animationProps}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1"
          transition={{ ...animationDurations.item13 }}
          {...animationProps}
        >
          <Card>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl">{resultsLabels.waa.title}</CardTitle>
              <CardDescription className="text-md">{resultsLabels.waa.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.waa, animationDurations.item13.delay)}
              />
            </CardContent>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl">{resultsLabels.total_waa.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.total_waa.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.total_waa, animationDurations.item13.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
