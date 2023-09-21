'use client';

import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { ColumnDef } from '@tanstack/react-table';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { ColumnHeader } from './column-header';
import { CategoryColumn } from './category-column';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

export const columns: ColumnDef<TransactionWithAccountName>[] = [
  {
    accessorKey: 'name',
    enableHiding: false,
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue<string>('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'account',
    header: ({ column }) => <ColumnHeader column={column} title="Account" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue<string>('account')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <ColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      return <CategoryColumn row={row} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{dollarFormatter(row.getValue<number>('amount') * -1)}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
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
];
