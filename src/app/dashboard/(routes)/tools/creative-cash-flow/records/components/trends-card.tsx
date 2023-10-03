import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { resultsLabels } from '../../labels';
import type { CreativeCashFlowRecord } from '../../types';

interface TrendsCardProps {
  record: CreativeCashFlowRecord;
}

export function TrendsCard({ record }: TrendsCardProps) {
  const actual_annual_trend = record.results.yearly_trend.reduce((a, b) => a + b, 0) / 3;

  return (
    <Card className="flex flex-col max-w-[500px] w-full min-w-[280px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{resultsLabels.trends.title}</CardTitle>
        <CardDescription>{resultsLabels.trends.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-lg">Period</TableHead>
              <TableHead className="text-lg">Daily</TableHead>
              <TableHead className="text-lg">Weekly</TableHead>
              <TableHead className="text-lg">Annual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg">
            <TableRow>
              <TableCell className="whitespace-nowrap">30 Days</TableCell>
              <TableCell>{dollarFormatter(record.results.daily_trend[0])}</TableCell>
              <TableCell>{dollarFormatter(record.results.weekly_trend[0])}</TableCell>
              <TableCell>{dollarFormatter(record.results.yearly_trend[0])}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">60 Days</TableCell>
              <TableCell>{dollarFormatter(record.results.daily_trend[1])}</TableCell>
              <TableCell>{dollarFormatter(record.results.weekly_trend[1])}</TableCell>
              <TableCell>{dollarFormatter(record.results.yearly_trend[1])}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">90 Days</TableCell>
              <TableCell>{dollarFormatter(record.results.daily_trend[2])}</TableCell>
              <TableCell>{dollarFormatter(record.results.weekly_trend[2])}</TableCell>
              <TableCell>{dollarFormatter(record.results.yearly_trend[2])}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <CardHeader className="space-y-1 px-0 pb-2">
            <CardTitle className="text-2xl">{resultsLabels.year_to_date.title}</CardTitle>
            {resultsLabels.year_to_date.description && (
              <CardDescription>{resultsLabels.year_to_date.description}</CardDescription>
            )}
          </CardHeader>
          <div className="text-2xl">{dollarFormatter(record.results.year_to_date)}</div>
        </div>
        <div>
          <CardHeader className="space-y-1 px-0 pb-2">
            <CardTitle className="text-2xl">
              {resultsLabels.actual_collection_trend.title}
            </CardTitle>
            {resultsLabels.year_to_date.description && (
              <CardDescription>{resultsLabels.actual_collection_trend.description}</CardDescription>
            )}
          </CardHeader>
          <div className="text-2xl">{dollarFormatter(actual_annual_trend)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
