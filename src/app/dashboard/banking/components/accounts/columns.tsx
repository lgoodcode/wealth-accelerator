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
 */

export const columns: ColumnDef<Account>[] = [
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
      const enabledValue = row.getValue<boolean>('enabled');
      const enabled = enabledOptions.find(
        (option) => option.value === (enabledValue ? 'true' : 'false')
      );

      if (!enabled) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{enabled.label}</span>
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
