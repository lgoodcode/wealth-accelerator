'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { NoRecords } from './no-records';
import { debtSnowballRecordsAtom } from '../../atoms';
import type { DebtSnowballRecord } from '../../types';
import { DebtSnowballRecordsTable } from './table/debt-snowball-records-table';

interface RecordsProps {
  recordsData: DebtSnowballRecord[];
}

export function DebtSnowballRecords({ recordsData }: RecordsProps) {
  const [records, setRecords] = useAtom(debtSnowballRecordsAtom);

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
            <DebtSnowballRecordsTable records={records} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
