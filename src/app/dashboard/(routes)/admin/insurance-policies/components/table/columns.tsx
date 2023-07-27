'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { ColumnHeader } from './column-header';
import { UserInsurancePolicyView } from '../../types';

export const columns: ColumnDef<UserInsurancePolicyView>[] = [
  {
    accessorKey: 'name',
    enableHiding: false,
    enableGlobalFilter: true,
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
      const valueToCompare = row.getValue<string>(id).toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'policy',
    enableHiding: false,
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Policy" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<UserInsurancePolicyView>('policy').policy_name}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const valueToCompare = row.getValue<string>(id).toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'company',
    enableHiding: false,
    enableGlobalFilter: true,
    header: ({ column }) => <ColumnHeader column={column} title="Comapny" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<UserInsurancePolicyView>('policy').company_name}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const valueToCompare = row.getValue<string>(id).toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
];
