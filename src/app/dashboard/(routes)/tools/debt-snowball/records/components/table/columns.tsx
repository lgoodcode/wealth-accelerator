'use client';

import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';

import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { DebtSnowballRecord } from '../../../types';

export const columns: ColumnDef<DebtSnowballRecord>[] = [
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
          <span>{format(new Date(row.getValue<string>('created_at')), 'LLL d, y - h:mm a')}</span>
        </div>
      );
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
