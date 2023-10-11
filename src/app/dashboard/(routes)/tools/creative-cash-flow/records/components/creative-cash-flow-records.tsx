'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { NoRecords } from './no-records';
import { CreativeCashFlowRecordsTable } from './table/creative-cash-flow-records-table';
import { ccfRecordsAtom } from '../../atoms';
import type { CreativeCashFlowRecord } from '../../types';

interface CreativeCashFlowRecordsProps {
  recordsData: CreativeCashFlowRecord[];
}

export function CreativeCashFlowRecords({ recordsData }: CreativeCashFlowRecordsProps) {
  const [records, setRecords] = useAtom(ccfRecordsAtom);

  useEffect(() => {
    setRecords(recordsData);
  }, []);

  if (records && !records.length) {
    return <NoRecords />;
  }

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full mt-8">
        <CardContent>
          {!records ? (
            <Loading className="mt-0 py-32" />
          ) : (
            <CreativeCashFlowRecordsTable records={records} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
