'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { CreateWaaInfoDialog } from '../create-waa-info-dialog';
import type { WaaInfo } from '@/lib/types/waa-info';

interface TableToolbarProps {
  table: Table<WaaInfo>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const isFiltered = !!table.getColumn('date')?.getFilterValue();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-3">
        <DateRangePicker
          text="Filter Dates"
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
            <X className="ml-1 h-5 w-5 my-auto" />
          </Button>
        )}
      </div>

      <CreateWaaInfoDialog />
    </div>
  );
}
