'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Role } from '@/lib/types';
import { roleOptions } from './column-options';
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
          <span className="max-w-[500px] truncate font-medium">{row.getValue<string>('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<string>('email')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    enableGlobalFilter: false,
    header: ({ column }) => <ColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const category = roleOptions.find((option) => option.value === row.getValue<Role>('role'));

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
    accessorKey: 'confirmed_email',
    enableGlobalFilter: false,
    header: ({ column }) => <ColumnHeader column={column} title="Confirmed Email" />,
    cell: ({ row }) => {
      const confirmed = row.getValue<boolean>('confirmed_email');

      if (!confirmed) {
        return (
          <div className="flex items-center">
            <span>
              <Badge variant="warning">Unconfirmed</Badge>
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center">
          <span>
            <Badge>Confirmed</Badge>
          </span>
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
