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
import { useDeleteWaaInfo } from '../../hooks/use-delete-waa-info';
import type { WaaInfo } from '@/lib/types/waa-info';

interface DeleteWaaInfoDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  record: WaaInfo;
}

export function DeleteWaaInfoDialog({ open, onOpenChange, record }: DeleteWaaInfoDialogProps) {
  const deleteWaaInfo = useDeleteWaaInfo();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const date = new Date(record.date).toLocaleDateString();
    setIsDeleting(true);

    await deleteWaaInfo(record.id)
      .then(() => {
        toast.success(
          <span>
            WAA record for <span className="font-bold">{date}</span> has been removed
          </span>
        );
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to WAA record for <span className="font-bold">{date}</span>
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
