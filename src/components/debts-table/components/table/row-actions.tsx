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
import { DeleteDebtMenuItem } from '../delete-debt-menu-item';
import { UpdateDebtDialog } from '../update-debt-dialog';
import type { Debt } from '@/lib/types/debts';

interface RowActionsProps {
  row: Row<Debt>;
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
          <DeleteDebtMenuItem row={row} />
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateDebtDialog
        open={showUpdateDialog}
        onOpenChange={handleUpdateDialogOpenChange}
        debt={row.original}
      />
    </>
  );
}
