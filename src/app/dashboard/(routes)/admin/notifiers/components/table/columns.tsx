'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { Notifier } from '@/lib/types/notifier';

export const columns: ColumnDef<Notifier>[] = [
  {
    accessorKey: 'name',
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue<string>('name')}</span>
        </div>
      );
    },
  },
  {
    enableGlobalFilter: true,
    accessorKey: 'email',
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue<string>('email')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'contact_email',
    enableGlobalFilter: false,
    header: ({ column }) => <ColumnHeader column={column} title="Contact Email" />,
    cell: ({ row }) => {
      const isEnabled = row.getValue<boolean>('contact_email') ? 'true' : 'false';

      return (
        <div className="flex items-center justify-center">
          <div>{isEnabled === 'true' ? <Check /> : <X />}</div>
        </div>
      );
    },
    // Need to convert the value to a string because the filterFn value is an array of strings
    filterFn: (row, id, value) => {
      return value.includes(row.getValue<boolean>(id) ? 'true' : 'false');
    },
  },
  {
    accessorKey: 'creative_cash_flow',
    enableGlobalFilter: false,
    header: ({ column }) => <ColumnHeader column={column} title="Creative Cash Flow" />,
    cell: ({ row }) => {
      const isEnabled = row.getValue<boolean>('creative_cash_flow') ? 'true' : 'false';

      return (
        <div className="flex items-center justify-center">
          <div>{isEnabled === 'true' ? <Check /> : <X />}</div>
        </div>
      );
    },
    // Need to convert the value to a string because the filterFn value is an array of strings
    filterFn: (row, id, value) => {
      return value.includes(row.getValue<boolean>(id) ? 'true' : 'false');
    },
  },
  {
    accessorKey: 'debt_snowball',
    enableGlobalFilter: false,
    header: ({ column }) => <ColumnHeader column={column} title="Debt Snowball" />,
    cell: ({ row }) => {
      const isEnabled = row.getValue<boolean>('debt_snowball') ? 'true' : 'false';

      return (
        <div className="flex items-center justify-center">
          <div>{isEnabled === 'true' ? <Check /> : <X />}</div>
        </div>
      );
    },
    // Need to convert the value to a string because the filterFn value is an array of strings
    filterFn: (row, id, value) => {
      return value.includes(row.getValue<boolean>(id) ? 'true' : 'false');
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
