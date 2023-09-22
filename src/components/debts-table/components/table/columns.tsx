'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { Debt } from '@/lib/types/debts';

export const columns = (rowActions: boolean, enableHeaderOptions = true): ColumnDef<Debt>[] => {
  const cols: ColumnDef<Debt>[] = [
    {
      accessorKey: 'description',
      enableHiding: false,
      header: ({ column }) => (
        <ColumnHeader
          column={column}
          title="Description"
          enableHeaderOptions={enableHeaderOptions}
        />
      ),
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
      header: ({ column }) => (
        <ColumnHeader column={column} title="Amount" enableHeaderOptions={enableHeaderOptions} />
      ),
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
      header: ({ column }) => (
        <ColumnHeader column={column} title="Payment" enableHeaderOptions={enableHeaderOptions} />
      ),
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
      header: ({ column }) => (
        <ColumnHeader column={column} title="Interest" enableHeaderOptions={enableHeaderOptions} />
      ),
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
      header: ({ column }) => (
        <ColumnHeader
          column={column}
          title="Months Remaining"
          enableHeaderOptions={enableHeaderOptions}
        />
      ),
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
  ];

  if (rowActions) {
    cols.push({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <RowActions row={row} />
        </div>
      ),
    });
  }

  return cols;
};
