'use client';

import Link from 'next/link';
import { format } from 'date-fns';

import type { DebtSnowballRecord } from '../../types';
import { dollarFormatter } from '@/lib/utils/dollar-formatter';

interface RecordsListProps {
  records: DebtSnowballRecord[];
}

export function DebtSnowballRecordsList({ records }: RecordsListProps) {
  return (
    <div className="w-full space-y-6">
      {records.map((record) => (
        <div
          key={record.id}
          className="max-w-lg mx-auto py-8 pl-6 px-4 bg-card/50 hover:bg-card/80 cursor-pointer hover:underline"
        >
          <Link href={`/dashboard/tools/debt-snowball/records/${record.id}`}>
            <div className="flex flex-row justify-between gap-4 text-xl font-medium">
              <h3>{format(new Date(record.created_at), 'LLL d, y - h:mm a')}</h3>
              <h3>{dollarFormatter(record.debts.reduce((acc, debt) => acc + debt.amount, 0))}</h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
