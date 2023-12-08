'use client';

import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { ColumnHeader } from './column-header';
import type { VisualizeCcf } from '../../../types';

export const columns: ColumnDef<VisualizeCcf>[] = [
  {
    accessorKey: 'range',
    header: ({ column }) => <ColumnHeader column={column} title="Dates" />,
    cell: ({ row }) => {
      const dates = row.getValue<VisualizeCcf['range']>('range');

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{`${format(
            dates.start,
            'LLL d, y'
          )} - ${format(dates.end, 'LLL d, y')}`}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'collections',
    header: ({ column }) => <ColumnHeader column={column} title="Collections" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {dollarFormatter(row.getValue<VisualizeCcf['collections']>('collections'))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'waa',
    header: ({ column }) => <ColumnHeader column={column} title="WAA" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {dollarFormatter(row.getValue<VisualizeCcf['waa']>('waa'))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => <ColumnHeader column={column} title="Account Balance" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="font-medium">
            {dollarFormatter(row.getValue<VisualizeCcf['balance']>('balance'))}
          </span>
        </div>
      );
    },
  },
];
