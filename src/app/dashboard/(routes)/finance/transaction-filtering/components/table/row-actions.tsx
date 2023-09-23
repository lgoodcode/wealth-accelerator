'use client';

import { useState, useCallback } from 'react';
import { MoreHorizontal, Pen } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteFilterMenuItem } from '../delete-user-plaid-filter-menu-item';
import { UpdateUserPlaidFilterDialog } from '../update-user-plaid-filter-dialog';
import type { UserFilter } from '@/lib/plaid/types/transactions';

interface RowActionsProps {
  row: Row<UserFilter>;
}

export function RowActions({ row }: RowActionsProps) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const handleUpdateDialogOpenChange = useCallback((open?: boolean) => {
    setShowUpdateDialog((prev) => open ?? !prev);
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
          <DeleteFilterMenuItem row={row} />
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateUserPlaidFilterDialog
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        filter={row.original}
      />
    </>
  );
}
