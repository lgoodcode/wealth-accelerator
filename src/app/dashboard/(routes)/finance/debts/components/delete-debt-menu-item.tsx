import { toast } from 'react-toastify';
import { captureException } from '@sentry/nextjs';
import { Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDeleteDebt } from '../use-delete-debt';
import type { Debt } from '@/lib/types/debts';

interface DeleteFilterMenuItemProps {
  row: Row<Debt>;
}

export function DeleteDebtMenuItem({ row }: DeleteFilterMenuItemProps) {
  const deleteDebt = useDeleteDebt();

  const handleDeleteFilter = async () => {
    await deleteDebt(row.original.id)
      .then(() => {
        toast.success(
          <span>
            Removed debt <span className="font-bold">{row.original.description}</span>
          </span>
        );
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error(
          <span>
            Failed to remove debt <span className="font-bold">{row.original.description}</span>
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
