'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Row,
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

import { cn } from '@/lib/utils/cn';
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
import type { CreativeCashFlowRecord } from '../../../types';

interface CreativeCashFlowRecordsTableProps {
  records: CreativeCashFlowRecord[] | null;
}

export function CreativeCashFlowRecordsTable({ records }: CreativeCashFlowRecordsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const onRowClick = (row: Row<CreativeCashFlowRecord>) => {
    router.push(`/dashboard/tools/creative-cash-flow/records/${row.original.id}`);
  };

  const table = useReactTable<CreativeCashFlowRecord>({
    data: records || [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: (row, id, value) => {
      const val: string = row.getValue<string>(id).toLocaleLowerCase();
      const isDate = id === 'created_at';

      if (isDate) {
        return format(new Date(val), 'M/d/yy - h:mm a').toLowerCase().includes(value.toLowerCase());
      }
      return val.includes(value.toLowerCase());
    },
    enableGlobalFilter: true,
    enableHiding: false,
    autoResetPageIndex: false,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 w-full">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={(value: string) => setGlobalFilter(value)}
      />
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell, i, arr) => (
                    <TableCell
                      key={cell.id}
                      className={cn({
                        'w-[10%]': i === arr.length - 1,
                      })}
                      onClick={() => i < arr.length - 1 && onRowClick(row)}
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
