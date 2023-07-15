'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
import { NoRecords } from './no-records';
import { RecordsList } from './records-list';
import { creativeCashFlowRecordsAtom } from '../../atoms';
import type { CreativeCashFlowRecord } from '../../types';

interface RecordsProps {
  recordsData: CreativeCashFlowRecord[];
}

export function Records({ recordsData }: RecordsProps) {
  const [records, setRecords] = useAtom(creativeCashFlowRecordsAtom);

  useEffect(() => {
    setRecords(recordsData);
  }, []);

  if (!records) {
    return <Loading />;
  } else if (!records.length) {
    return <NoRecords />;
  }

  return <RecordsList records={records} />;
}
