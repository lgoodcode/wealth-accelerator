'use client';

import { useCallback, useState } from 'react';
import { useAtomValue } from 'jotai';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { selectedInstitutionAtom } from '@/lib/plaid/atoms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { InstitutionSelection } from './institution-selection';
import { RenameInstitution } from './rename-institution';
import { DeleteInstitution } from './delete-institution';

export function ManageInstitutions() {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);

  const handleRenameDialogOpenChange = useCallback((open?: boolean) => {
    setShowRenameDialog((prev) => (open ? open : !prev));
  }, []);

  const handleDeleteDialogOpenChange = useCallback((open?: boolean) => {
    setShowDeleteDialog((prev) => (open ? open : !prev));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-start">
      <div className="w-full mr-auto py-4">
        {selectedInstitution && (
          <h2 className="text-3xl capitalize font-medium tracking-tighter">
            {selectedInstitution?.name ?? 'Select an institution'}
          </h2>
        )}
      </div>

      <div className="flex h-20 w-full justify-start lg:justify-end items-center space-x-2">
        <InstitutionSelection />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" disabled={!selectedInstitution}>
              <span className="sr-only">Actions</span>
              <MoreHorizontal />
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

        <RenameInstitution
          open={showRenameDialog}
          onOpenChange={handleRenameDialogOpenChange}
          institution={selectedInstitution}
        />

        <DeleteInstitution
          open={showDeleteDialog}
          onOpenChange={handleDeleteDialogOpenChange}
          institution={selectedInstitution}
        />
      </div>
    </div>
  );
}
