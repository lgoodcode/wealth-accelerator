'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { ColumnHeader } from './column-header';
import { RowActions } from './row-actions';
import type { InsurancePolicyRow } from '../../../types';

export const columns: ColumnDef<InsurancePolicyRow>[] = [
  {
    accessorKey: 'year',
    header: ({ column }) => <ColumnHeader column={column} title="Year" />,
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue<number>('year')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const valueToCompare = row.getValue<string>(id).toLowerCase();
      return valueToCompare.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'age_end_year',
    header: ({ column }) => <ColumnHeader column={column} title="Age" />,
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue<number>('age_end_year')}
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
    accessorKey: 'annual_net_outlay',
    header: ({ column }) => <ColumnHeader column={column} title="Annual Net Outlay" />,
    cell: ({ row }) => {
      return (
        <div className="text-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dollarFormatter(row.getValue<number>('annual_net_outlay'))}
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
    accessorKey: 'cumulative_net_outlay',
    header: ({ column }) => <ColumnHeader column={column} title="Cumulative Net Outlay" />,
    cell: ({ row }) => {
      return (
        <div className="text-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dollarFormatter(row.getValue<number>('cumulative_net_outlay'))}
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
    accessorKey: 'net_cash_value_end_year',
    header: ({ column }) => <ColumnHeader column={column} title="Net Cash Value" />,
    cell: ({ row }) => {
      return (
        <div className="text-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dollarFormatter(row.getValue<number>('net_cash_value_end_year'))}
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
    accessorKey: 'net_annual_cash_value_increase',
    header: ({ column }) => <ColumnHeader column={column} title="Net Annual Cash Value Increase" />,
    cell: ({ row }) => {
      return (
        <div className="text-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dollarFormatter(row.getValue<number>('net_annual_cash_value_increase'))}
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
    accessorKey: 'net_death_benefit_end_year',
    header: ({ column }) => <ColumnHeader column={column} title="Net Death Benefit" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dollarFormatter(row.getValue<number>('net_death_benefit_end_year'))}
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
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowActions row={row} />
      </div>
    ),
  },
];
