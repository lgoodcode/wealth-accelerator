'use client';

import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
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
import { useDeleteSnowballRecord } from '../../hooks/use-delete-snowball-record';
import type { DebtSnowballRecord } from '../../types';

interface DeleteRecordButtonProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  record: DebtSnowballRecord;
}

export function DeleteSnowballRecordDialog({
  open,
  onOpenChange,
  record,
}: DeleteRecordButtonProps) {
  const deleteRecord = useDeleteSnowballRecord();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteRecord(record.id)
      .then(() => {
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error, {
          extra: { id: record.id },
        });
        toast.error('Failed to delete record');
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
