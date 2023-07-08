import { dollarFormatter } from '@/lib/utils/dollarFormatter';
import { resultsLabels } from '../../labels';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import type { CreativeCashFlowRecord } from '../../types';

interface TrendsCardProps {
  record: CreativeCashFlowRecord;
}

export function TrendsCard({ record }: TrendsCardProps) {
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
              <TableHead className="w-[120px]">Period</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Weekly</TableHead>
              <TableHead>Annual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-lg">
            <TableRow>
              <TableCell>30 Days</TableCell>
              <TableCell>{dollarFormatter(record.results.monthly_trend[0])}</TableCell>
              <TableCell>{dollarFormatter(record.results.weekly_trend[0])}</TableCell>
              <TableCell>{dollarFormatter(record.results.yearly_trend[0])}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>60 Days</TableCell>
              <TableCell>{dollarFormatter(record.results.monthly_trend[1])}</TableCell>
              <TableCell>{dollarFormatter(record.results.weekly_trend[1])}</TableCell>
              <TableCell>{dollarFormatter(record.results.yearly_trend[1])}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>90 Days</TableCell>
              <TableCell>{dollarFormatter(record.results.monthly_trend[2])}</TableCell>
              <TableCell>{dollarFormatter(record.results.weekly_trend[2])}</TableCell>
              <TableCell>{dollarFormatter(record.results.yearly_trend[2])}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div>
          <CardHeader className="space-y-1 px-0">
            <CardTitle className="text-2xl">{resultsLabels.year_to_date.title}</CardTitle>
            <CardDescription>{resultsLabels.year_to_date.description}</CardDescription>
          </CardHeader>
          <div className="pt-4 text-2xl">${record.results.year_to_date}</div>
        </div>
      </CardContent>
    </Card>
  );
}
