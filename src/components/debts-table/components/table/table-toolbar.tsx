'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateDebtDialog } from '../create-debt-dialog';
import type { Debt } from '@/lib/types/debts';

interface TableToolbarProps {
  table: Table<Debt>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-3">
        <Input
          placeholder="Filter debts"
          value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
          className="h-9 w-[150px] lg:w-[250px]"
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

      <CreateDebtDialog />
    </div>
  );
}
