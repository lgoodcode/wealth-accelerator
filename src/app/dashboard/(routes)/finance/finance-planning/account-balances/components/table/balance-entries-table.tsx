'use client';

import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ACCOUNT_BALANCES_ENTRIES_KEY } from '@/config/constants/react-query';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { Loading } from '@/components/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { columns } from './columns';
import { TableToolbar } from './table-toolbar';
import { TablePagination } from './table-pagination';
import { selectedAccountAtom } from '../../atoms';
import type { BalancesEntry } from '@/lib/types/balances';

const getEntries = async (account_id?: number): Promise<BalancesEntry[]> => {
  if (!account_id) return [];

  const { error, data } = await supabase
    .from('balances_entries')
    .select('*')
    .eq('account_id', account_id)
    .order('date', { ascending: false });

  if (error || !data) {
    throw error || new Error('No entries returned');
  }

  return data;
};

export function BalanceEntriesTable() {
  const selectedAccount = useAtomValue(selectedAccountAtom);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { isError, isFetching, isRefetching, data } = useQuery<BalancesEntry[]>(
    [ACCOUNT_BALANCES_ENTRIES_KEY, selectedAccount?.id],
    () => getEntries(selectedAccount?.id),
    {
      staleTime: 1000 * 60 * 60,
    }
  );

  const table = useReactTable<BalancesEntry>({
    data: data || [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    enableHiding: false,
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isError) {
    return <h3>Error</h3>;
  } else if (isFetching || isRefetching) {
    return <Loading className="mt-0 py-32" />;
  }

  return (
    <div className="space-y-4 w-full">
      <TableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell, i, arr) => (
                    <TableCell
                      key={cell.id}
                      className={cn({
                        'w-[10%]': i === arr.length - 1,
                      })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-lg">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
