'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { categoryOptions } from './column-options';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import { Category, type Filter } from '@/lib/plaid/types/transactions';

export const columns: ColumnDef<Filter>[] = [
  {
    accessorKey: 'filter',
    header: ({ column }) => <ColumnHeader column={column} title="Filter" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<string>('filter')}
          </span>
        </div>
      );
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
