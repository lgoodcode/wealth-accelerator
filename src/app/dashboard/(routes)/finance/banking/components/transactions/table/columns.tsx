'use client';

import type { DateRange } from 'react-day-picker';
import type { ColumnDef } from '@tanstack/react-table';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { formattedDate } from '@/lib/utils/formatted-date';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import { CategoryColumn } from './category-column';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

/**
 * NOTES
 *
 * `row.getValue<string>('name')`, when retrieving the value of a column, specify the type of the value
 * to ensure that the value is of the correct type.
 *
 * The filterFn `value` is the value set from the table.getColumn('date')?.setFilterValue() call.
 */

export const columns: ColumnDef<TransactionWithAccountName>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => <ColumnHeader column={column} title="Task" />,
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
          {formattedDate(new Date(row.getValue<string>('date')))}
        </div>
      );
    },
    filterFn: (row, id, value: DateRange) => {
      const date = new Date(row.getValue<string>(id));
      console.log({ row, id, value }, date);
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
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowActions row={row} />
      </div>
    ),
  },
];
