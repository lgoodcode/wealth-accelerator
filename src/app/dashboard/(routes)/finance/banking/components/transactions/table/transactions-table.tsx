'use client';

import { useState } from 'react';
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

import { cn } from '@/lib/utils/cn';
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
import { useTransactions } from '../../../hooks/use-transactions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

interface TransactionsTableProps {
  item: ClientInstitution;
}

export function TransactionsTable({ item }: TransactionsTableProps) {
  // const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { isError, isFetching, transactions } = useTransactions(item);

  const table = useReactTable<TransactionWithAccountName>({
    data: transactions,
    columns,
    state: {
      sorting,
      columnVisibility,
      // rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    autoResetPageIndex: false,
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
  } else if (isFetching) {
    return <Loading title="Fetching transactions..." />;
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
                    <TableCell
                      key={cell.id}
                      className={cn({
                        'w-[40%]': i === 0,
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
