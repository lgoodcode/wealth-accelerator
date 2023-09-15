'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
import { NoRecords } from './no-records';
import { DebtSnowballRecordsList } from './debt-snowball-records-list';
import { debtSnowballRecordsAtom } from '../../atoms';
import type { DebtSnowballRecord } from '../../types';

interface RecordsProps {
  recordsData: DebtSnowballRecord[];
}

export function DebtSnowballRecords({ recordsData }: RecordsProps) {
  const [records, setRecords] = useAtom(debtSnowballRecordsAtom);

  useEffect(() => {
    setRecords(recordsData);
  }, []);

  if (!records) {
    return <Loading />;
  } else if (!records.length) {
    return <NoRecords />;
  }

  return <DebtSnowballRecordsList records={records} />;
}
