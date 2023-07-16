import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import type { Row } from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { selectedInstitutionAtom } from '@/lib/plaid/atoms';
import { useUpdateTransaction } from '../../use-update-transaction';
import { updateTransactionFormSchema, type UpdateTransactionType } from '../../schemas';
import { Category, type TransactionWithAccountName } from '@/lib/plaid/types/transactions';

interface UpdateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  row: Row<TransactionWithAccountName>;
}

export function UpdateTransactionDialog({ open, onOpenChange, row }: UpdateTransactionDialogProps) {
  const updateTransaction = useUpdateTransaction();
  const queryClient = useQueryClient();
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const form = useForm<UpdateTransactionType>({
    resolver: zodResolver(updateTransactionFormSchema),
    values: {
      name: row.original.name,
      category: row.original.category,
    },
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: UpdateTransactionType) => updateTransaction(row.original.id, data),
    onError: (error) => {
      console.error(error);
      captureException(error);
      toast.error('An error occurred while updating the transaction');
    },
    // On success, update the query cache
    onSuccess: (updatedTransaction) => {
      if (updatedTransaction) {
        queryClient.setQueryData<TransactionWithAccountName[]>(
          ['transactions', selectedInstitution?.item_id],
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
        toast.success('Transaction updated');
      } else {
        toast.error('An error occurred while updating the transaction');
      }
    },
    onSettled: () => onOpenChange(false),
  });

  const onSubmitUpdate = useCallback((data: UpdateTransactionType) => mutate(data), [mutate]);

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update transaction</DialogTitle>
          <DialogDescription>
            Update information for <span className="font-bold">{row.original.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmitUpdate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Category).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="secondary" disabled={isLoading} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} onClick={form.handleSubmit(onSubmitUpdate)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
