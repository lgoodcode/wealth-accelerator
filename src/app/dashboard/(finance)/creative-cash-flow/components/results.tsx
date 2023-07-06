'use client';

import { useAtomValue } from 'jotai';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import type { CountUpProps } from 'react-countup/build/CountUp';

import { labels } from '../labels';
import { creativeCashFlowInputsAtom, creativeCashFlowResultAtom } from '../atoms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ANIMATION_PROPS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
const ANIMATION_DURATIONS = {
  row1: {
    duration: 1,
    delay: 0.5,
  },
  row2: {
    duration: 1,
    delay: 1.25,
  },
  row3: {
    duration: 1,
    delay: 2,
  },
  row4: {
    duration: 1,
    delay: 2.75,
  },
};

const createCountUpProps = (end: number, delay = 0): CountUpProps => ({
  end,
  delay,
  duration: 2,
  decimalPlaces: 2,
  prefix: '$',
});

export function Results() {
  const inputs = useAtomValue(creativeCashFlowInputsAtom);
  const results = useAtomValue(creativeCashFlowResultAtom);

  if (!results) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 grid-rows-5 gap-6">
      <motion.div
        className="col-span-1 col-start-2 row-span-1 row-start-1"
        transition={{ ...ANIMATION_DURATIONS.row1 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.optimal_savings_strategy.title}</CardTitle>
            <CardDescription>{labels.optimal_savings_strategy.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp
              className="text-2xl"
              {...createCountUpProps(inputs.optimal_savings_strategy)}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-2"
        transition={{ ...ANIMATION_DURATIONS.row2 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.business_profit_before_tax.title}</CardTitle>
            <CardDescription>{labels.business_profit_before_tax.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp
              className="text-2xl"
              {...createCountUpProps(results.business_profit_before_tax)}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-2"
        transition={{ ...ANIMATION_DURATIONS.row2 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.lifestyle_expenses.title}</CardTitle>
            <CardDescription>{labels.lifestyle_expenses.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp className="text-2xl" {...createCountUpProps(results.lifestyle_expenses)} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-2"
        transition={{ ...ANIMATION_DURATIONS.row2 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.lifestyle_expenses_tax.title}</CardTitle>
            <CardDescription>{labels.lifestyle_expenses_tax.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp className="text-2xl" {...createCountUpProps(results.lifestyle_expenses_tax)} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-3"
        transition={{ ...ANIMATION_DURATIONS.row3 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.tax_on_business_profit.title}</CardTitle>
            <CardDescription>{labels.tax_on_business_profit.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp className="text-2xl" {...createCountUpProps(results.tax_account)} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-3"
        transition={{ ...ANIMATION_DURATIONS.row3 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.business_overhead.title}</CardTitle>
            <CardDescription>{labels.business_overhead.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp className="text-2xl" {...createCountUpProps(results.business_overhead)} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-3 row-span-full"
        transition={{ ...ANIMATION_DURATIONS.row3 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.business_overhead.title}</CardTitle>
            <CardDescription>{labels.business_overhead.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Period</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Weekly</TableHead>
                  <TableHead>Annual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-lg">
                <TableRow>
                  <TableCell>30 Days</TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.monthly_trend[0],
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.weekly_trend[0],
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.yearly_trend[0],
                        ANIMATION_DURATIONS.row4.delay
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
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.weekly_trend[1],
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.yearly_trend[1],
                        ANIMATION_DURATIONS.row4.delay
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
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.weekly_trend[2],
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <CountUp
                      {...createCountUpProps(
                        results.yearly_trend[2],
                        ANIMATION_DURATIONS.row4.delay
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-4"
        transition={{ ...ANIMATION_DURATIONS.row4 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.WAA.title}</CardTitle>
            <CardDescription>{labels.WAA.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp className="text-2xl" {...createCountUpProps(results.WAA)} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="col-span-1 row-start-4"
        transition={{ ...ANIMATION_DURATIONS.row4 }}
        {...ANIMATION_PROPS}
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{labels.collections.title}</CardTitle>
            <CardDescription>{labels.collections.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CountUp className="text-2xl" {...createCountUpProps(results.collections)} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
