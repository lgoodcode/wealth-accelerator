import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import { fetcher } from '@/lib/utils/fetcher';
import { deleteInstitutionAtom } from '@/lib/atoms/institutions';
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

interface DeleteInstitutionProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  institution: ClientInstitution | null;
}

export function DeleteInstitution({ open, onOpenChange, institution }: DeleteInstitutionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteInstitution = useSetAtom(deleteInstitutionAtom);

  const handleDelete = async () => {
    if (!institution) {
      return;
    }

    setIsLoading(true);

    const { error } = await fetcher(`/api/plaid/institutions/remove/${institution.item_id}`, {
      method: 'DELETE',
    });

    if (error) {
      console.error(error);
    } else {
      toast.success(
        <span>
          Institution <span className="font-bold">{institution.name}</span> has been removed
        </span>
      );

      onOpenChange(false);
      deleteInstitution(institution.item_id);
    }

    setIsLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This institution and all the data associated with it will
            be deleted.
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
