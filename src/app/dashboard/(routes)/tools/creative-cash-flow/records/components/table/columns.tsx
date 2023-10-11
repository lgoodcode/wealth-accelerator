'use client';

import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';

import { ColumnHeader } from './column-header';
import { CreativeCashFlowMenu } from '../creative-cash-flow-menu';
import type { CreativeCashFlowRecord } from '../../../types';

export const columns: ColumnDef<CreativeCashFlowRecord>[] = [
  {
    accessorKey: 'name',
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.getValue<string>('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{format(new Date(row.getValue<string>('created_at')), 'M/d/yy - h:mm a')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'inputs',
    enableGlobalFilter: false,
    header: ({ column }) => <ColumnHeader column={column} title="Date Range" />,
    sortingFn: (row) => {
      const startDate = new Date(row.original.inputs.start_date);
      const endDate = new Date(row.original.inputs.end_date);
      return endDate.getTime() - startDate.getTime();
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {format(new Date(row.original.inputs.start_date), 'LLL d, y') +
              ' - ' +
              format(new Date(row.original.inputs.end_date), 'LLL d, y')}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <CreativeCashFlowMenu record={row.original} inTable />
      </div>
    ),
  },
];
