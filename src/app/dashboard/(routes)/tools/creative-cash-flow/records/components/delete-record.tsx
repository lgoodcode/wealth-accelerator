'use client';

import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { toast } from 'react-toastify';

import { useDeleteRecord } from '../use-delete-record';
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
import { removeCreativeCashFlowRecordAtom } from '../../atoms';
import type { CreativeCashFlowRecord } from '../../types';

interface DeleteRecordProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  record: CreativeCashFlowRecord;
}

export function DeleteRecord({ open, onOpenChange, record }: DeleteRecordProps) {
  const deleteRecord = useDeleteRecord();
  const [isDeleting, setIsDeleting] = useState(false);
  const removeRecord = useSetAtom(removeCreativeCashFlowRecordAtom);

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteRecord(record.inputs.id)
      .then(() => {
        toast.success('Successfully removed record');
        onOpenChange(false);
        removeRecord(record.inputs.id);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to remove record');
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
