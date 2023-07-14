'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { creativeCashFlowRecordsAtom } from '../../atoms';
import { InputsCard } from './inputs-card';
import { ResultsCard } from './results-card';
import { TrendsCard } from './trends-card';
import { ShareRecordButton } from './share-record-button';
import { DeleteRecord } from './delete-record';
import type { CreativeCashFlowRecord } from '../../types';

interface RecordsProps {
  recordsData: CreativeCashFlowRecord[];
}

export function Records({ recordsData }: RecordsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [records, setRecords] = useAtom(creativeCashFlowRecordsAtom);

  const handleDeleteDialogOpenChange = useCallback((open?: boolean) => {
    setShowDeleteDialog((prev) => open ?? !prev);
  }, []);

  useEffect(() => {
    setRecords(recordsData);
  }, []);

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
    <Accordion type="single" collapsible className="w-full space-y-6">
      {records.map((record) => (
        <AccordionItem key={record.inputs.id} value={record.inputs.id}>
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

            <div className="flex justify-end pt-8 gap-4">
              <ShareRecordButton record={record} />
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash size={20} className="mr-2" />
                Delete
              </Button>

              <DeleteRecord
                open={showDeleteDialog}
                onOpenChange={handleDeleteDialogOpenChange}
                record={record}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
