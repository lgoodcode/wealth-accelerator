'use client';

import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import CountUp from 'react-countup';
import { MoveDown, MoveRight } from 'lucide-react';
import type { CountUpProps } from 'react-countup/build/CountUp';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { resultsLabels } from '../../labels';
import { creativeCashFlowResultAtom } from '../../atoms';

const ANIMATION_PROPS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

type AnimationDurations = {
  [key: `item${number}`]: {
    duration: 1;
    delay: number;
  };
};

const ANIMATION_DURATIONS = Array.from({ length: 20 }).reduce(
  (acc: any, _, i) => ({
    ...acc,
    [`item${i + 1}`]: {
      duration: 1,
      delay: (i + 1) * 0.5,
    },
  }),
  {}
) as AnimationDurations;

const createCountUpProps = (end: number, delay = 0): CountUpProps => ({
  end,
  delay,
  duration: 2,
  decimalPlaces: 2,
  prefix: '$',
});

export function CreativeCashFlowResults() {
  const results = useAtomValue(creativeCashFlowResultAtom);

  if (!results) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="grid gap-6 w-fit mx-auto grid-cols-[auto_320px_64px_320px] lg:grid-cols-[0px_480px_64px_480px]">
        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item1 }}
          {...ANIMATION_PROPS}
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
                {...createCountUpProps(results.collections, ANIMATION_DURATIONS.item1.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item2 }}
          {...ANIMATION_PROPS}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item3 }}
          {...ANIMATION_PROPS}
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
                {...createCountUpProps(results.business_overhead, ANIMATION_DURATIONS.item3.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item4 }}
          {...ANIMATION_PROPS}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item5 }}
          {...ANIMATION_PROPS}
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
                {...createCountUpProps(results.lifestyle_expenses, ANIMATION_DURATIONS.item5.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-3 row-span-1 flex items-center"
          transition={{ ...ANIMATION_DURATIONS.item6 }}
          {...ANIMATION_PROPS}
        >
          <MoveRight className="w-16 h-16 mx-auto text-destructive" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1 row-start-5 flex items-center"
          transition={{ ...ANIMATION_DURATIONS.item7 }}
          {...ANIMATION_PROPS}
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
                  ANIMATION_DURATIONS.item7.delay
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item8 }}
          {...ANIMATION_PROPS}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-2 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item9 }}
          {...ANIMATION_PROPS}
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
                  ANIMATION_DURATIONS.item9.delay
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-3 row-span-1 flex items-center"
          transition={{ ...ANIMATION_DURATIONS.item10 }}
          {...ANIMATION_PROPS}
        >
          <MoveRight className="w-16 h-16 mx-auto text-destructive" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1 row-start-9 flex items-center"
          transition={{ ...ANIMATION_DURATIONS.item11 }}
          {...ANIMATION_PROPS}
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
                {...createCountUpProps(results.tax_account, ANIMATION_DURATIONS.item11.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item12 }}
          {...ANIMATION_PROPS}
        >
          <MoveDown className="w-16 h-16 mx-auto" />
        </motion.div>

        <motion.div
          className="col-span-1 col-start-4 row-span-1"
          transition={{ ...ANIMATION_DURATIONS.item13 }}
          {...ANIMATION_PROPS}
        >
          <Card>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl">{resultsLabels.waa.title}</CardTitle>
              <CardDescription className="text-md">{resultsLabels.waa.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CountUp
                className="text-2xl"
                {...createCountUpProps(results.waa, ANIMATION_DURATIONS.item13.delay)}
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
                {...createCountUpProps(results.total_waa, ANIMATION_DURATIONS.item13.delay)}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-4"
          transition={{ ...ANIMATION_DURATIONS.item14 }}
          {...ANIMATION_PROPS}
        >
          <Card className="w-fit mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{resultsLabels.trends.title}</CardTitle>
              <CardDescription className="text-md">
                {resultsLabels.trends.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] text-lg">Period</TableHead>
                    <TableHead className="text-lg">Actual</TableHead>
                    <TableHead className="text-lg">Weekly</TableHead>
                    <TableHead className="text-lg">Annual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-lg">
                  <TableRow>
                    <TableCell>30 Days</TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.monthly_trend[0],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.weekly_trend[0],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.yearly_trend[0],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>60 Days</TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.monthly_trend[1],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.weekly_trend[1],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.yearly_trend[1],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>90 Days</TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.monthly_trend[2],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.weekly_trend[2],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <CountUp
                        {...createCountUpProps(
                          results.yearly_trend[2],
                          ANIMATION_DURATIONS.item14.delay
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <CardHeader className="space-y-1 px-0">
                  <CardTitle className="text-2xl">{resultsLabels.year_to_date.title}</CardTitle>
                  <CardDescription className="text-md">
                    {resultsLabels.year_to_date.description}
                  </CardDescription>
                </CardHeader>
                <CountUp
                  className="text-2xl"
                  {...createCountUpProps(results.year_to_date, ANIMATION_DURATIONS.item14.delay)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
