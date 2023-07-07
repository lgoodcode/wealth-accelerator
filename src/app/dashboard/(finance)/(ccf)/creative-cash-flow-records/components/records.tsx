'use client';

import Link from 'next/link';
import { format } from 'date-fns';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputsCard } from './inputs-card';
import { ResultsCard } from './results-card';
import { TrendsCard } from './trends-card';
import type { CreativeCashFlowRecord } from '../../types';

interface RecordsProps {
  records: CreativeCashFlowRecord[];
}

export function Records({ records }: RecordsProps) {
  if (!records.length) {
    return (
      <div className="flex justify-center text-center">
        <Card className="max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">No Records Found</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Link href="/dashboard/creative-cash-flow" className="text-lg link underline">
              Visit the Creative Cash Flow page and save a record
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {records.map((record) => (
        <Accordion key={record.inputs.id} type="single" collapsible className="w-full">
          <AccordionItem value={record.inputs.id}>
            <AccordionTrigger className="text-xl pl-6 py-8">
              {format(new Date(record.inputs.start_date), 'LLL dd, y') +
                ' - ' +
                format(new Date(record.inputs.end_date), 'LLL dd, y')}
            </AccordionTrigger>
            <AccordionContent className="p-6">
              <div className="flex flex-row justify-center w-full gap-8 flex-wrap">
                <InputsCard record={record} />

                <ResultsCard record={record} />

                <TrendsCard record={record} />
              </div>

              <div className="flex justify-end p-6 pt-8 pb-0">
                <Button variant="destructive">Delete</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
