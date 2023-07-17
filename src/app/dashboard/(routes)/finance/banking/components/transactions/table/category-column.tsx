import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Row } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categoryOptions } from './column-options';
import { useUpdateTransaction } from '../../../use-update-transaction';
import { Category, type TransactionWithAccountName } from '@/lib/plaid/types/transactions';
import { captureException } from '@sentry/nextjs';

interface CategoryColumnProps {
  row: Row<TransactionWithAccountName>;
}

export function CategoryColumn({ row }: CategoryColumnProps) {
  const queryClient = useQueryClient();
  const updateTransaction = useUpdateTransaction();
  const category = categoryOptions.find(
    (option) => option.value === row.getValue<Category>('category')
  );

  const { isLoading, mutate } = useMutation({
    mutationFn: (newCategory: Category) =>
      updateTransaction(row.original.id, {
        name: row.original.name,
        category: newCategory,
      }),
    onError: (error) => {
      console.error(error);
      captureException(error);
      toast.error('An error occurred while updating the transaction');
    },
    // On success, update the query cache
    onSuccess: (updatedTransaction) => {
      if (updatedTransaction) {
        queryClient.setQueryData<TransactionWithAccountName[]>(
          ['transactions', row.original.item_id],
          (oldTransactions) => {
            if (oldTransactions) {
              return oldTransactions.map((transaction) => {
                if (transaction.id === updatedTransaction.id) {
                  return {
                    ...updatedTransaction,
                    account: transaction.account,
                  };
                }
                return transaction;
              });
            }
            return oldTransactions;
          }
        );
      } else {
        toast.error('An error occurred while updating the transaction');
      }
    },
  });

  const handleUpdate = useCallback((newCategory: Category) => mutate(newCategory), [mutate]);

  if (!category) {
    return null;
  }

  return (
    <Select value={category.value} onValueChange={handleUpdate}>
      <SelectTrigger disabled={isLoading}>
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent side="bottom">
        {categoryOptions.map((cat) => (
          <SelectItem key={cat.value} value={cat.value}>
            {cat.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
