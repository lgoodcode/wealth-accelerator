'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { ColumnHeader } from './column-header';
import { UserInsurancePolicyView } from '../../types';

export const columns: ColumnDef<UserInsurancePolicyView>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<UserInsurancePolicyView['user']>('user').name}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const valueToCompare = row
        .getValue<UserInsurancePolicyView['user']>('user')
        .name.toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'policy',
    header: ({ column }) => <ColumnHeader column={column} title="Policy" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<UserInsurancePolicyView['policy']>('policy').name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'company',
    header: ({ column }) => <ColumnHeader column={column} title="Company" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<UserInsurancePolicyView['company']>('company').name}
          </span>
        </div>
      );
    },
  },
];
