'use client';

import { useState, useCallback } from 'react';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
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
import { useDeleteNotifier } from '../../use-delete-notifier';
import { UpdateNotifierDialog } from '../update-notifier-dialog';
import type { Notifier } from '../../types';

interface RowActionsProps {
  row: Row<Notifier>;
}

export function RowActions({ row }: RowActionsProps) {
  const deleteNotifier = useDeleteNotifier();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const handleUpdateDialogOpenChange = useCallback((open?: boolean) => {
    setShowUpdateDialog((prev) => open ?? !prev);
  }, []);

  const handleDelete = useCallback(async () => {
    await deleteNotifier(row.original.id).catch((error) => {
      console.error(error);
      captureException(error);
      toast.error('Failed to delete notifier');
    });
  }, [row.original.id]);

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
          <DropdownMenuItem onSelect={handleDelete} className="text-red-600 font-medium">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateNotifierDialog
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        notifier={row.original}
      />
    </>
  );
}
