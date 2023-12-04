'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FacetedFilter } from './faceted-filter';
import { roleOptions } from './column-options';
import { InviteUserDialog } from '../invite-user-dialog';
import type { ManageUser } from '@/lib/types/manage-user';

interface TableToolbarProps {
  table: Table<ManageUser>;
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
          placeholder="Filter users"
          value={globalFilter || ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="h-9 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <FacetedFilter column={table.getColumn('role')} title="Role" options={roleOptions} />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={handleReset} className="h-9 px-2 lg:px-3">
            Reset
            <X className="ml-1 h-5 w-5 my-auto" />
          </Button>
        )}
      </div>

      <InviteUserDialog />
    </div>
  );
}
