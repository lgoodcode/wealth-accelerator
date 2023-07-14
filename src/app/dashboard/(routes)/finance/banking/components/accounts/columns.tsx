'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { typeOptions, enabledOptions } from './column-options';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { Account, AccountType } from '@/lib/plaid/types/institutions';

/**
 * NOTES
 *
 * `row.getValue<string>('name')`, when retrieving the value of a column, specify the type of the value
 * to ensure that the value is of the correct type.
 *
 * The filterFn `value` is the value set from the table.getColumn('date')?.setFilterValue() call.
 */

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
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
    accessorKey: 'type',
    header: ({ column }) => <ColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = typeOptions.find((type) => type.value === row.getValue<AccountType>('type'));

      if (!type) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
