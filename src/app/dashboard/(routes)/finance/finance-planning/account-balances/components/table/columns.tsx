'use client';

import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { BalancesEntry } from '@/lib/types/balances';

export const columns: ColumnDef<BalancesEntry>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => <ColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {format(new Date(row.getValue<string>('date')), 'M/d/yyyy')}
        </div>
      );
    },
    filterFn: (row, id, value: DateRange) => {
      const date = new Date(row.getValue<Date>(id));

      if (value.from && value.to) {
        return date >= value.from && date <= value.to;
      }
      if (value.from) {
        return date >= value.from;
      }

      return false;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{dollarFormatter(row.getValue<number>('amount'))}</span>
        </div>
      );
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowActions row={row} />
      </div>
    ),
  },
];
