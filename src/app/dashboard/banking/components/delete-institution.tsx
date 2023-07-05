import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import { fetcher } from '@/lib/utils/fetcher';
import { removeInstitutionAtom } from '@/lib/plaid/atoms';
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
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

const deleteInstitution = async (item_id: string) => {
  const { error } = await fetcher(`/api/plaid/institutions/remove/${item_id}`, {
    method: 'DELETE',
  });

  throw error;
};

interface DeleteInstitutionProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  institution: ClientInstitution | null;
}

export function DeleteInstitution({ open, onOpenChange, institution }: DeleteInstitutionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const removeInstitution = useSetAtom(removeInstitutionAtom);

  const handleDelete = async () => {
    if (!institution) {
      return;
    }

    setIsLoading(true);

    deleteInstitution(institution.item_id)
      .then(() => {
        toast.success(
          <span>
            Institution <span className="font-bold">{institution.name}</span> has been removed
          </span>
        );

        onOpenChange(false);
        removeInstitution(institution.item_id);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to remove institution <span className="font-bold">{institution.name}</span>
          </span>
        );
      })
      .finally(() => setIsLoading(false));
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
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} loading={isLoading}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
