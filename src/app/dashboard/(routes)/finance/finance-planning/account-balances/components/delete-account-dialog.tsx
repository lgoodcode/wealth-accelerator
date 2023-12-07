import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteAccount } from '../hooks/use-delete-account';
import type { BalancesAccount } from '@/lib/types/balances';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  account: BalancesAccount | null;
}

export function DeleteAccountDialog({ open, onOpenChange, account }: DeleteAccountDialogProps) {
  const deleteAccount = useDeleteAccount();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!account) {
      return;
    }

    setIsDeleting(true);

    await deleteAccount(account.id)
      .then(() => {
        toast.success(
          <span>
            Account <span className="font-bold">{account.name}</span> has been removed
          </span>
        );

        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to remove account <span className="font-bold">{account.name}</span>
          </span>
        );
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. <span className="font-bold">{account?.name}</span> and all
            the data associated with it will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} loading={isDeleting}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
