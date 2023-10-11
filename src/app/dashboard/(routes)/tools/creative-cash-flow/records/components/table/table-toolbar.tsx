'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreativeCashFlowRecord } from '../../../types';

interface TableToolbarProps {
  table: Table<CreativeCashFlowRecord>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function TableToolbar({ table, globalFilter, setGlobalFilter }: TableToolbarProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;
  const handleReset = () => {
    setGlobalFilter('');
    table.resetGlobalFilter();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-3">
        <Input
          placeholder="Filter records"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
