'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { categoryOptions } from './column-options';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { TransactionWithAccountName, Category } from '@/lib/plaid/types/transactions';

/**
 * NOTES
 *
 * `row.getValue<string>('name')`, when retrieving the value of a column, specify the type of the value
 * to ensure that the value is of the correct type.
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
    accessorKey: 'account_name',
    header: ({ column }) => <ColumnHeader column={column} title="Account" />,
    cell: ({ row }) => {
      // const type = typeOptions.find((type) => type.value === row.getValue<string>('account_name'));

      // if (!type) {
      //   return null;
      // }

      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue<string>('account_name')}</span>
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
      const category = categoryOptions.find(
        (option) => option.value === row.getValue<Category>('category')
      );

      if (!category) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{category.label}</span>
        </div>
      );
    },
    // Need to convert the value to a string because the filterFn value is an array of strings
    filterFn: (row, id, value) => {
      return value.includes(row.getValue<boolean>(id) ? 'true' : 'false');
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <ColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const category = categoryOptions.find(
        (option) => option.value === row.getValue<Category>('category')
      );

      if (!category) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{category.label}</span>
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
