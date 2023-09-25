'use client';

import { useState, useCallback } from 'react';
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
import { UpdateGlobalPlaidFilterDialog } from '../update-global-plaid-filter-dialog';
import { DeleteGlobalPlaidFilterDialog } from '../delete-global-plaid-filter-dialog';
import type { Filter } from '@/lib/plaid/types/transactions';

interface RowActionsProps {
  row: Row<Filter>;
}

export function RowActions({ row }: RowActionsProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleUpdateDialogOpenChange = useCallback((open?: boolean) => {
    setShowUpdateDialog((prev) => open ?? !prev);
  }, []);
  const handleDeleteDialogOpenChange = useCallback((open?: boolean) => {
    setShowDeleteDialog((prev) => open ?? !prev);
  }, []);

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
            <Pen className="mr-2 h-4 w-4 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 font-medium"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateGlobalPlaidFilterDialog
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        filter={row.original}
      />

      <DeleteGlobalPlaidFilterDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteDialogOpenChange}
        filter={row.original}
      />
    </>
  );
}
