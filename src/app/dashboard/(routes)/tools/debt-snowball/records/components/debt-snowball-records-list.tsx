'use client';

import { format } from 'date-fns';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
// import { InputsCard } from './inputs-card';
// import { ResultsCard } from './results-card';
// import { TrendsCard } from './trends-card';
// import { ShareRecordButton } from './share-record-button';
// import { DeleteRecordButton } from './delete-record-button';
import type { DebtSnowballRecord } from '../../types';

interface RecordsListProps {
  records: DebtSnowballRecord[];
}

export function DebtSnowballRecordsList({ records }: RecordsListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-6">
      {records.map((record) => (
        <AccordionItem key={record.id} value={String(record.id)}>
          <AccordionTrigger className="text-xl pl-6 py-8">
            {format(new Date(record.created_at), 'LLL d, y - h:mm a')}
          </AccordionTrigger>
          <AccordionContent className="p-6">
            {/* <div className="flex flex-row justify-center w-full gap-6 flex-wrap">
              <InputsCard record={record} />
              <ResultsCard record={record} />
              <TrendsCard record={record} />
            </div>

            <div className="flex justify-end pt-8 gap-4">
              <ShareRecordButton record={record} />
              <DeleteRecordButton record={record} />
            </div>
            */}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
