'use client';

import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { Trash } from 'lucide-react';

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
import { useDeleteRecord } from '../hooks/use-delete-record';
import type { CreativeCashFlowRecord } from '../../types';

interface DeleteRecordButtonProps {
  record: CreativeCashFlowRecord;
}

export function DeleteRecordButton({ record }: DeleteRecordButtonProps) {
  const deleteRecord = useDeleteRecord();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteRecord(record.inputs.id)
      .then(() => {
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error, {
          extra: { id: record.inputs.id },
        });
        toast.error('Failed to remove record');
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
        <Trash size={20} className="mr-2" />
        Delete
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
    </>
  );
}
