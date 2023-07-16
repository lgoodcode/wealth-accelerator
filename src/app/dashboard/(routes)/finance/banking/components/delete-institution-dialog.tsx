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
import { useDeleteInstitution } from '../use-delete-institution';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface DeleteInstitutionDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  institution: ClientInstitution | null;
}

export function DeleteInstitutionDialog({
  open,
  onOpenChange,
  institution,
}: DeleteInstitutionDialogProps) {
  const deleteInstitution = useDeleteInstitution();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!institution) {
      return;
    }

    setIsDeleting(true);

    await deleteInstitution(institution.item_id)
      .then(() => {
        toast.success(
          <span>
            Institution <span className="font-bold">{institution.name}</span> has been removed
          </span>
        );

        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to remove institution <span className="font-bold">{institution.name}</span>
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
            This action cannot be undone. <span className="font-bold">{institution?.name}</span> and
            all the data associated with it will be deleted.
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
