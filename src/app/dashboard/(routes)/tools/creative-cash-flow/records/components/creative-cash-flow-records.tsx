'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { NoRecords } from './no-records';
import { RecordsList } from './records-list';
import { creativeCashFlowRecordsAtom } from '../../atoms';
import type { CreativeCashFlowRecord } from '../../types';

interface CreativeCashFlowRecordsProps {
  recordsData: CreativeCashFlowRecord[];
}

export function CreativeCashFlowRecords({ recordsData }: CreativeCashFlowRecordsProps) {
  const [records, setRecords] = useAtom(creativeCashFlowRecordsAtom);

  useEffect(() => {
    setRecords(recordsData);
  }, []);

  if (records && !records.length) {
    return <NoRecords />;
  }

  if (!records) {
    return (
      <div className="flex justify-center mx-auto lg:w-[1024px]">
        <Card className="w-full mt-8">
          <CardContent>
            <Loading className="mt-0 py-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RecordsList records={records} />;
}
