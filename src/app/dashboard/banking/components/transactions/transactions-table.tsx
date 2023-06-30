'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { captureException } from '@sentry/nextjs';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { supabase } from '@/lib/supabase/client';
import { ClientError } from '@/components/client-error';
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
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

const getTransactions = async (item_id: string) => {
  const { error, data } = await supabase.rpc('get_transactions_with_account_name', {
    ins_item_id: item_id,
  });

  if (error) {
    console.error(error);
    captureException(error);
  }

  return (data ?? []) as TransactionWithAccountName[];
};

interface TransactionsTableProps {
  item_id: string;
}

export function TransactionsTable({ item_id }: TransactionsTableProps) {
  // const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    isError,
    isLoading,
    data: transactions = [], // Use default value because initialData will be used and cached
  } = useQuery<TransactionWithAccountName[]>(
    ['transactions', item_id],
    () => getTransactions(item_id),
    {
      staleTime: 1000 * 60 * 5, // Cache transactions, which might change often, for 5 minutes
    }
  );

  const table = useReactTable<TransactionWithAccountName>({
    data: transactions,
    columns,
    state: {
      sorting,
      columnVisibility,
      // rowSelection,
      columnFilters,
    },
    // enableRowSelection: true,
    // onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isError) {
    return <ClientError />;
  } else if (isLoading) {
    return <Loading title="Fetching accounts..." />;
  }

  return (
    <div className="space-y-4 mt-8">
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
                    <TableCell key={cell.id} className={i === arr.length - 1 ? 'w-[10%]' : ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
