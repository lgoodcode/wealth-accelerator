import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
import { useDeleteUserPlaidFilter } from '../hooks/use-delete-user-plaid-filter';
import type { UserFilter } from '@/lib/plaid/types/transactions';

interface DeleteInstitutionDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  filter: UserFilter;
}

export function DeleteUserPlaidFilterDialog({
  open,
  onOpenChange,
  filter,
}: DeleteInstitutionDialogProps) {
  const deleteFilter = useDeleteUserPlaidFilter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteFilter(filter.id)
      // Update the filters and invalidate the transactions query to force a refetch
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        toast.success(
          <span>
            Filter <span className="font-bold">{filter.filter}</span> has been removed
          </span>
        );
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to remove filter <span className="font-bold">{filter.filter}</span>
          </span>
        );
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Filter <b className="font-extrabold italic">{filter.filter}</b>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will re-categorize all transactions that this filter is connected to the default
            category based on the transaction&apos;s amount.
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
