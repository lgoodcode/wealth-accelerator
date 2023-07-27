'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Role } from '@/lib/types';
import { roleOptions } from './column-options';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';

/**
 * NOTES
 *
 * `row.getValue<string>('name')`, when retrieving the value of a column, specify the type of the value
 * to ensure that the value is of the correct type.
 *
 * The filterFn `value` is the value set from the table.getColumn('date')?.setFilterValue() call.
 */

export const columns: ColumnDef<User>[] = [
  // {
  //   accessorKey: 'name',
  //   enableHiding: false,
  //   enableGlobalFilter: true,
  //   header: ({ column }) => <ColumnHeader column={column} title="Name" />,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-medium">{row.getValue<string>('name')}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     const valueToCompare = row.getValue<string>(id).toLowerCase();
  //     return valueToCompare.includes(value.toLowerCase());
  //   },
  // },
  // {
  //   accessorKey: 'email',
  //   enableHiding: false,
  //   enableGlobalFilter: true,
  //   header: ({ column }) => <ColumnHeader column={column} title="Email" />,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue<string>('email')}
  //         </span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     const valueToCompare = row.getValue<string>(id).toLowerCase();
  //     return valueToCompare.includes(value.toLowerCase());
  //   },
  // },
  // {
  //   accessorKey: 'role',
  //   header: ({ column }) => <ColumnHeader column={column} title="Role" />,
  //   cell: ({ row }) => {
  //     const category = roleOptions.find((option) => option.value === row.getValue<Role>('role'));
  //     if (!category) {
  //       return null;
  //     }
  //     return (
  //       <div className="flex items-center">
  //         <span>{category.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => (
  //     <div className="flex justify-end">
  //       <RowActions row={row} />
  //     </div>
  //   ),
  // },
];
