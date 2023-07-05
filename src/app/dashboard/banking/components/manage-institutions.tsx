'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { toast } from 'react-toastify';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { fetcher } from '@/lib/utils/fetcher';
import { Button } from '@/components/ui/button';
import { selectedInstitutionAtom, setSelectedInstitutionAtom } from '@/lib/atoms/institutions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { InstitutionSelection } from './institution-selection';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import { RenameInstitution } from './rename-institution';

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function ManageInstitutions({ institutions }: InstitutionsProps) {
  const router = useRouter();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const setSelectedInstitution = useSetAtom(setSelectedInstitutionAtom);

  const handleRenameDialogOpenChange = useCallback((open?: boolean) => {
    setShowRenameDialog((prev) => (open ? open : !prev));
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedInstitution) {
      return;
    }

    setIsWaiting(true);

    // Revoke access token
    const { error: plaidError } = await fetcher(
      `/api/plaid/institutions/remove/${selectedInstitution.item_id}`,
      {
        method: 'DELETE',
      }
    );

    // Don't show error for revoking the access token
    if (plaidError) {
      console.error(plaidError);
    }

    toast.success(
      <span>
        Institution <span className="font-bold">{selectedInstitution.name}</span> has been removed
      </span>
    );

    setIsWaiting(false);
    setShowDeleteDialog(false);
    setSelectedInstitution(null);
    // Refresh the page to update the data
    router.refresh();
  }, [selectedInstitution, setSelectedInstitution, router]);

  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-start">
      <div className="w-full mr-auto py-4">
        <h2 className="text-3xl capitalize font-medium tracking-tighter">
          {selectedInstitution?.name ?? 'Select an institution'}
        </h2>
      </div>

      <div className="flex h-20 w-full justify-start lg:justify-end items-center space-x-2">
        <InstitutionSelection
          institutions={institutions}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
        />
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

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This institution and all the data associated with it
                will be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isWaiting}>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDelete} loading={isWaiting}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
