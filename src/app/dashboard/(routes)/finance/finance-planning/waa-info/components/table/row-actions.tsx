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
import { UpdateWaaInfoDialog } from '../update-waa-info-dialog';
import { DeleteWaaInfoDialog } from '../delete-waa-info-dialog';
import type { WaaInfo } from '@/lib/types/waa-info';

interface RowActionsProps {
  row: Row<WaaInfo>;
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
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600 font-medium"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateWaaInfoDialog
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        record={row.original}
      />

      <DeleteWaaInfoDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteDialogOpenChange}
        record={row.original}
      />
    </>
  );
}
