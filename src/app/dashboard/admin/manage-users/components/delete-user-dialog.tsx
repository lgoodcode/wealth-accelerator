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
import { useDeleteUser } from '../use-delete-user';

interface DeleteUserProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  id: string;
  user: User;
}

export function DeleteUserDialog({ open, onOpenChange, id, user }: DeleteUserProps) {
  const deleteUser = useDeleteUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    if (id === user.id) {
      toast.error('You cannot delete yourself');
      return;
    }

    await deleteUser(user.id)
      .then(() => {
        toast.success(
          <span>
            User <span className="font-bold">{user.name}</span> has been removed
          </span>
        );
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          <span>
            Failed to remove user <span className="font-bold">{user.name}</span>
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
            This action cannot be undone. <span className="font-bold">{user.name}</span> and all the
            data associated with the user will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} loading={isDeleting}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
