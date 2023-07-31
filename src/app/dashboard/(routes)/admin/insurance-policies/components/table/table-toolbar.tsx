'use client';

import { useRouter } from 'next/navigation';
import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserInsurancePolicyView } from '../../types';

interface TableToolbarProps {
  table: Table<UserInsurancePolicyView>;
}

export function TableToolbar({ table }: TableToolbarProps) {
  const router = useRouter();
  const isFiltered =
    table.getPreFilteredRowModel().rows.length > table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter policies..."
          value={(table.getColumn('name')?.getFilterValue() as string) || ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
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

      <Button onClick={() => router.push('/dashboard/admin/insurance-policies/create')}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Policy
      </Button>
    </div>
  );
}
