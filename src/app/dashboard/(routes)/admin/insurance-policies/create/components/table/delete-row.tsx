import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { useDeleteRow } from '../../hooks/use-delete-row';
import type { InsurancePolicyRow } from '../../../types';

interface DeleteRowProps {
  row: Row<InsurancePolicyRow>;
}

export function DeleteRow({ row }: DeleteRowProps) {
  const deleteRow = useDeleteRow();

  return (
    <Button variant="ghost" className="px-3" onClick={() => deleteRow(parseInt(row.id))}>
      <Trash className="h-5 w-5 text-destructive" />
    </Button>
  );
}
