'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FacetedFilter } from './faceted-filter';
import { categoryOptions } from './column-options';
import { CreateGlobalPlaidFilterDialog } from '../create-global-plaid-filter-dialog';
import type { Filter } from '@/lib/plaid/types/transactions';

interface TableToolbarProps {
  table: Table<Filter>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter filters"
          value={(table.getColumn('filter')?.getFilterValue() ?? '') as string}
          onChange={(event) => table.getColumn('filter')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('category') && (
          <FacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categoryOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <CreateGlobalPlaidFilterDialog />
    </div>
  );
}
