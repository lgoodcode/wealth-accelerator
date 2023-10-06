'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FacetedFilter } from './faceted-filter';
import { typeOptions, enabledOptions } from './column-options';
import type { Account } from '@/lib/plaid/types/institutions';

interface TableToolbarProps {
  table: Table<Account>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-3">
        <Input
          placeholder="Filter accounts"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('type') && (
          <FacetedFilter column={table.getColumn('type')} title="Type" options={typeOptions} />
        )}
        {table.getColumn('enabled') && (
          <FacetedFilter
            column={table.getColumn('enabled')}
            title="Enabled"
            options={enabledOptions}
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
    </div>
  );
}
