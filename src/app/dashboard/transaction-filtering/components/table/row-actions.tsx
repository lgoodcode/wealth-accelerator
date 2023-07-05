'use client';

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSetAtom } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { MoreHorizontal, Pen, Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { removeFilterAtom } from '../../atoms';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UpdateFilterModal } from '../update-filter-modal';
import { type Filter } from '@/lib/plaid/types/transactions';

const deleteFilter = async (id: number) => {
  const { error } = await supabase.from('plaid_filters').delete().eq('id', id);

  if (error) {
    throw error;
  }
};

interface RowActionsProps {
  row: Row<Filter>;
}

export function RowActions({ row }: RowActionsProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const removeFilter = useSetAtom(removeFilterAtom);

  const handleUpdateDialogOpenChange = useCallback((open?: boolean) => {
    setShowUpdateDialog((prev) => (open ? open : !prev));
  }, []);

  const handleDeleteFilter = () => {
    deleteFilter(row.original.id)
      .then(() => {
        toast.success('Filter updated');
        removeFilter(row.original.id);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to update filter');
      });
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
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDeleteFilter} className="text-red-600 font-medium">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateFilterModal
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        filter={row.original}
      />
    </>
  );
}
