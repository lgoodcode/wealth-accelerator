'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { ViewOptions } from './view-options';
import { FacetedFilter } from './faceted-filter';
import { useAccountOptions, categoryOptions } from './column-options';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';
import { DateRange } from 'react-day-picker';

interface TableToolbarProps {
  table: Table<TransactionWithAccountName>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const accountOptions = useAccountOptions();
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
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
        <CalendarDateRangePicker
          selected={table.getColumn('date')?.getFilterValue() as DateRange}
          onSelect={(dateRange) => table.getColumn('date')?.setFilterValue(dateRange)}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <ViewOptions table={table} />
    </div>
  );
}
