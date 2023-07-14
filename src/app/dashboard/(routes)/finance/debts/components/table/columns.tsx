'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { Debt } from '@/lib/types/debts';
import { dollarFormatter } from '@/lib/utils/dollarFormatter';

/**
 * NOTES
 *
 * `row.getValue<string>('name')`, when retrieving the value of a column, specify the type of the value
 * to ensure that the value is of the correct type.
 *
 * The filterFn `value` is the value set from the table.getColumn('date')?.setFilterValue() call.
 */

export const columns: ColumnDef<Debt>[] = [
  // {
  //   id: 'select',
  //   enableSorting: false,
  //   enableHiding: false,
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
  // },
  {
    accessorKey: 'description',
    enableHiding: false,
    header: ({ column }) => <ColumnHeader column={column} title="Description" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<string>('description')}
          </span>
        </div>
      );
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'payment',
    header: ({ column }) => <ColumnHeader column={column} title="Payment" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{dollarFormatter(row.getValue<number>('payment'))}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'interest',
    header: ({ column }) => <ColumnHeader column={column} title="Interest" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue<number>('interest').toFixed(2)}%</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'months_remaining',
    header: ({ column }) => <ColumnHeader column={column} title="Months Remaining" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue<number>('months_remaining')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
