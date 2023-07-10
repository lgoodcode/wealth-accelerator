'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { enabledOptions } from './column-options';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { Notifier } from '../../types';

/**
 * NOTES
 *
 * The `enableGlobalFilter` option is used to enable the global filter for the columns so that
 * it filters against both name and email.
 */

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
    filterFn: (row, id, value) => {
      const valueToCompare = row.getValue<string>(id).toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'email',
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue<string>('email')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const valueToCompare = row.getValue<string>(id).toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'enabled',
    header: ({ column }) => <ColumnHeader column={column} title="Enabled" />,
    cell: ({ row }) => {
      const isEnabled = row.getValue<boolean>('enabled') ? 'true' : 'false';
      const enabled = enabledOptions.find((option) => option.value === isEnabled);

      if (!enabled) {
        return null;
      }

      return (
        <div className="flex items-center">
          <enabled.icon className="ml-4" />
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
