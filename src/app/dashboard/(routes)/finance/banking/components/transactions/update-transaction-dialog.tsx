import { useCallback, useEffect } from 'react';
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
  DialogClose,
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
import { useUpdateTransaction } from '../../hooks/use-update-transaction';
import { updateTransactionFormSchema, type UpdateTransactionForm } from '../../schema';
import { Category, type TransactionWithAccountName } from '@/lib/plaid/types/transactions';

interface UpdateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  row: Row<TransactionWithAccountName>;
}

export function UpdateTransactionDialog({ open, onOpenChange, row }: UpdateTransactionDialogProps) {
  const updateTransaction = useUpdateTransaction();
  const queryClient = useQueryClient();
  const form = useForm<UpdateTransactionForm>({
    resolver: zodResolver(updateTransactionFormSchema),
    values: {
      name: row.original.name,
      category: row.original.category,
    },
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: UpdateTransactionForm) => updateTransaction(row.original.id, data),
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
    onSettled: () => onOpenChange(false),
  });

  const onSubmitUpdate = useCallback((data: UpdateTransactionForm) => mutate(data), [mutate]);

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
          <DialogClose asChild>
            <Button variant="secondary" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" loading={isLoading} onClick={form.handleSubmit(onSubmitUpdate)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
