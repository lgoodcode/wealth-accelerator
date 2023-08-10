import { toast } from 'react-toastify';
import { captureException } from '@sentry/nextjs';
import { Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDeleteNotifier } from '../hooks/use-delete-notifier';
import type { Notifier } from '../types';

interface DeleteFilterMenuItemProps {
  row: Row<Notifier>;
}

export function DeleteNotifierMenuItem({ row }: DeleteFilterMenuItemProps) {
  const deleteNotifier = useDeleteNotifier();

  const handleDeleteFilter = async () => {
    await deleteNotifier(row.original.id)
      .then(() => {
        toast.success(
          <span>
            Removed notifier <span className="font-bold">{row.original.email}</span>
          </span>
        );
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error(
          <span>
            Failed to remove notifier <span className="font-bold">{row.original.email}</span>
          </span>
        );
      });
  };

  return (
    <DropdownMenuItem onSelect={handleDeleteFilter} className="text-red-600 font-medium">
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}
