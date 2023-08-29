'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FacetedFilter } from './faceted-filter';
import { roleOptions } from './column-options';
import { InviteUserDialog } from '../invite-user-dialog';
import type { ManageUser } from '@/lib/types';

interface TableToolbarProps {
  table: Table<ManageUser>;
  globalFilter: string;
  handleGlobalFilter: (value: string) => void;
}

export function TableToolbar({ table, globalFilter, handleGlobalFilter }: TableToolbarProps) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={globalFilter}
          onChange={(event) => handleGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <FacetedFilter column={table.getColumn('role')} title="Role" options={roleOptions} />
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

      <InviteUserDialog />
    </div>
  );
}
