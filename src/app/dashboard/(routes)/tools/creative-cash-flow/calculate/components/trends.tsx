import { useAtomValue } from 'jotai';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { animationProps, countUpProps } from '../../utils/animations';
import { resultsLabels } from '../../labels';
import { creativeCashFlowResultAtom } from '../../atoms';
import type { CreateCountUp } from '../../utils/create-count-up-props';

interface TrendsProps {
  createCountUpProps: CreateCountUp;
}

export function Trends({ createCountUpProps }: TrendsProps) {
  const results = useAtomValue(creativeCashFlowResultAtom);

  if (!results) {
    return null;
  }

  return (
    <motion.div className="col-start-4 row-start-1 row-span-3" {...animationProps()}>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{resultsLabels.trends.title}</CardTitle>
          <CardDescription className="text-md">{resultsLabels.trends.description}</CardDescription>
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
                <TableCell className="whitespace-nowrap">30 Days</TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.monthly_trend[0], countUpProps.item1.delay)}
                  />
                </TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.weekly_trend[0], countUpProps.item1.delay)}
                  />
                </TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.yearly_trend[0], countUpProps.item1.delay)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="whitespace-nowrap">60 Days</TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.monthly_trend[1], countUpProps.item1.delay)}
                  />
                </TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.weekly_trend[1], countUpProps.item1.delay)}
                  />
                </TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.yearly_trend[1], countUpProps.item1.delay)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="whitespace-nowrap">90 Days</TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.monthly_trend[2], countUpProps.item1.delay)}
                  />
                </TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.weekly_trend[2], countUpProps.item1.delay)}
                  />
                </TableCell>
                <TableCell>
                  <CountUp
                    {...createCountUpProps(results.yearly_trend[2], countUpProps.item1.delay)}
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
              {...createCountUpProps(results.year_to_date, countUpProps.item1.delay)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
