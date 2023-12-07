'use client';

import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { initcap } from '@/lib/utils/initcap';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { selectedAccountAtom } from '../atoms';
import { AccountSelection } from './account-selection';
import { RenameAccountDialog } from './rename-account-dialog';
import { DeleteAccountDialog } from './delete-account-dialog';

export function ManageAccounts() {
  const selectedAccount = useAtomValue(selectedAccountAtom);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRenameDialogOpenChange = useCallback((open?: boolean) => {
    setShowRenameDialog((prev) => open ?? !prev);
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open?: boolean) => {
    setShowDeleteDialog((prev) => open ?? !prev);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-start">
      <div className="w-full mr-auto">
        {!!selectedAccount && (
          <h2 className="text-3xl capitalize font-medium tracking-tighter">
            {initcap(selectedAccount.name)}
          </h2>
        )}
      </div>

      <div className="flex w-full justify-start lg:justify-end items-center space-x-2">
        <AccountSelection />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" disabled={!selectedAccount}>
              <span className="sr-only">Actions</span>
              <MoreHorizontal className="w-8 h-8" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
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

        <RenameAccountDialog
          open={showRenameDialog}
          onOpenChange={handleRenameDialogOpenChange}
          account={selectedAccount}
        />

        <DeleteAccountDialog
          open={showDeleteDialog}
          onOpenChange={handleDeleteDialogOpenChange}
          account={selectedAccount}
        />
      </div>
    </div>
  );
}
