'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ViewOptions } from './view-options';
import { FacetedFilter } from './faceted-filter';
import { useAccountOptions, categoryOptions } from './column-options';
import type { DateRange } from 'react-day-picker';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

interface TableToolbarProps {
  table: Table<TransactionWithAccountName>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const accountOptions = useAccountOptions();
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-3">
        <Input
          placeholder="Filter transactions"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-9 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('account') && (
          <FacetedFilter
            column={table.getColumn('account')}
            title="Account"
            options={accountOptions}
          />
        )}
        {table.getColumn('category') && (
          <FacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categoryOptions}
          />
        )}
        <DateRangePicker
          selected={table.getColumn('date')?.getFilterValue() as DateRange}
          onSelect={(dateRange) => table.getColumn('date')?.setFilterValue(dateRange)}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            Reset
            <X className="ml-1 h-5 w-5 my-auto" />
          </Button>
        )}
      </div>
      <ViewOptions table={table} />
    </div>
  );
}
