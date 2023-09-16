'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MoreHorizontal, Pen, Trash } from 'lucide-react';

import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RenameSnowballRecordDialog } from './rename-snowball-record-dialog';
import { DeleteSnowballRecordDialog } from './delete-snowball-record-dialog';
import type { DebtSnowballRecord } from '../../types';

interface RowActionsProps {
  record: DebtSnowballRecord;
  hasView?: boolean;
}

export function DebtSnowballMenu({ record, hasView }: RowActionsProps) {
  const user = useUser();
  const router = useRouter();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRenameDialogOpenChange = useCallback((open?: boolean) => {
    setShowRenameDialog((prev) => open ?? !prev);
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open?: boolean) => {
    setShowDeleteDialog((prev) => open ?? !prev);
  }, []);

  if (!user) {
    return null;
  }

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
          {hasView && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/tools/debt-snowball/records/${record.id}`)}
              >
                <Eye className="mr-2 h-4 w-4 text-muted-foreground/70" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
            <Pen className="mr-2 h-4 w-4 text-muted-foreground/70" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            disabled={user.id === record.user_id}
            className="text-red-600 font-medium"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameSnowballRecordDialog
        open={showRenameDialog}
        onOpenChange={handleRenameDialogOpenChange}
        record={record}
      />

      <DeleteSnowballRecordDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteDialogOpenChange}
        record={record}
      />
    </>
  );
}
