import { toast } from 'react-toastify';
import { captureException } from '@sentry/nextjs';
import { Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDeleteGlobalPlaidFilter } from '../hooks/use-delete-global-plaid-filter';
import type { Filter } from '@/lib/plaid/types/transactions';

interface DeleteFilterMenuItemProps {
  row: Row<Filter>;
}

export function DeleteGlobalPlaidFilterMenuItem({ row }: DeleteFilterMenuItemProps) {
  const deleteFilter = useDeleteGlobalPlaidFilter();

  const handleDeleteFilter = async () => {
    await deleteFilter(row.original.id)
      .then(() => {
        toast.success(
          <span>
            Removed filter <span className="font-bold">{row.original.filter}</span>
          </span>
        );
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error(
          <span>
            Failed to remove filter <span className="font-bold">{row.original.filter}</span>
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
