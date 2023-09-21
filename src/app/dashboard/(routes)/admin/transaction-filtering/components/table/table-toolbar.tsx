'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FacetedFilter } from './faceted-filter';
import { categoryOptions } from './column-options';
import { AddFilterDialog } from '../add-filter-dialog';
import type { Filter } from '@/lib/plaid/types/transactions';

interface TableToolbarProps {
  table: Table<Filter>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function TableToolbar({ table, globalFilter, setGlobalFilter }: TableToolbarProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;
  const handleReset = () => {
    setGlobalFilter('');
    table.resetColumnFilters();
    table.resetGlobalFilter();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter filters..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
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
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <AddFilterDialog />
    </div>
  );
}
