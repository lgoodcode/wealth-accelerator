'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MoreHorizontal, Pen, Trash } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShareCcfRecordMenuItem } from './share-ccf-record-menu-item';
import { RenameCcfRecordDialog } from './rename-ccf-record-dialog';
import { DeleteCcfRecordDialog } from './delete-ccf-record-dialog';
import type { CreativeCashFlowRecord } from '../../types';

interface RowActionsProps {
  className?: string;
  record: CreativeCashFlowRecord;
  hasView?: boolean;
  redirectOnDelete?: boolean;
}

export function CreativeCashFlowMenu({
  className,
  record,
  hasView,
  redirectOnDelete,
}: RowActionsProps) {
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

  const ccfRecordDeleteCallback = () => {
    if (redirectOnDelete) {
      router.refresh(); // Lazy way to force re-fetching data from the server
      router.push('/dashboard/tools/creative-cash-flow/records');
    }
  };

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
        <DropdownMenuContent align="end" className={cn('w-[160px]', className)}>
          {hasView && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/tools/creative-cash-flow/records/${record.id}`)
                }
              >
                <Eye className="mr-2 h-4 w-4 text-muted-foreground/70" />
                View
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
            <Pen className="mr-2 h-4 w-4 text-muted-foreground/70" />
            Rename
          </DropdownMenuItem>

          <ShareCcfRecordMenuItem record={record} />

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

      <RenameCcfRecordDialog
        open={showRenameDialog}
        onOpenChange={handleRenameDialogOpenChange}
        record={record}
      />

      <DeleteCcfRecordDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteDialogOpenChange}
        record={record}
        callback={ccfRecordDeleteCallback}
      />
    </>
  );
}
