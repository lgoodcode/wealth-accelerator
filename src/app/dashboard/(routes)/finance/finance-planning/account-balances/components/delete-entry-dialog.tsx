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
import { useDeleteEntry } from '../hooks/entry/use-delete-entry';
import { BalancesEntry } from '@/lib/types/balances';

interface DeleteEntryDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  entry: BalancesEntry;
}

export function DeleteEntryDialog({ open, onOpenChange, entry }: DeleteEntryDialogProps) {
  const deleteEntry = useDeleteEntry();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const date = new Date(entry.date).toLocaleDateString();

    setIsDeleting(true);

    await deleteEntry(entry.id)
      .then(() => {
        toast.success(
          <span>
            Balance entry record for <span className="font-bold">{date}</span> has been removed
          </span>
        );
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to balance entry record for <span className="font-bold">{date}</span>
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
        </AlertDialogHeader>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
