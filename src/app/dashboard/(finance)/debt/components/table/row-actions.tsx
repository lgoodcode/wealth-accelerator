'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { captureException } from '@sentry/nextjs';
import { MoreHorizontal, Pen, Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { useDeleteFilter } from '../../use-delete-filter';
// import { UpdateFilterDialog } from '../update-filter-dialog';
import type { Debt } from '@/lib/types/debts';

interface RowActionsProps {
  row: Row<Debt>;
}

export function RowActions({ row }: RowActionsProps) {
  // const deleteFilter = useDeleteFilter();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const handleUpdateDialogOpenChange = useCallback((open?: boolean) => {
    setShowUpdateDialog((prev) => open ?? !prev);
  }, []);

  const handleDeleteFilter = async () => {
    // await deleteFilter(row.original.id)
    //   .then(() => {
    //     toast.success(
    //       <span>
    //         Removed filter <span className="font-bold">{row.original.filter}</span>
    //       </span>
    //     );
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     captureException(error);
    //     toast.error(
    //       <span>
    //         Failed to remove filter <span className="font-bold">{row.original.filter}</span>
    //       </span>
    //     );
    //   });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-8 w-8" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDeleteFilter} className="text-red-600 font-medium">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <UpdateFilterDialog
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        filter={row.original}
      /> */}
    </>
  );
}
