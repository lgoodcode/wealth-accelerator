'use client';

import { z } from 'zod';
import { useState, useCallback } from 'react';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { MoreHorizontal, Pen } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Category, type TransactionWithAccountName } from '@/lib/plaid/types/transactions';

const updateTransactionFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this transaction.',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this tranasction.',
  }),
});

type UpdateTransactionType = z.infer<typeof updateTransactionFormSchema>;

const updateTransaction = async (transaction_id: string, data: UpdateTransactionType) => {
  const { error, data: updatedTransaction } = await supabase
    .from('plaid_transactions')
    .update({
      name: data.name,
      category: data.category,
    })
    .eq('id', transaction_id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return updatedTransaction as TransactionWithAccountName;
};

interface RowActionsProps {
  row: Row<TransactionWithAccountName>;
}

export function RowActions({ row }: RowActionsProps) {
  const queryClient = useQueryClient();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const form = useForm<UpdateTransactionType>({
    resolver: zodResolver(updateTransactionFormSchema),
    defaultValues: {
      name: row.original.name,
      category: row.original.category,
    },
  });

  const handleCloseUpdateDialog = useCallback(() => {
    form.reset();
    setShowUpdateDialog(false);
  }, [form]);

  const handleUpdateDialogOpenChange = useCallback(
    (open: boolean) => {
      form.reset();
      setShowUpdateDialog(open);
    },
    [form]
  );

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
          ['transactions'],
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
    onSettled: handleCloseUpdateDialog,
  });

  const onSubmitUpdate = useCallback((data: UpdateTransactionType) => mutate(data), [mutate]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-8 w-8" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
            <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showUpdateDialog} onOpenChange={handleUpdateDialogOpenChange}>
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
            <Button variant="secondary" disabled={isLoading} onClick={handleCloseUpdateDialog}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} onClick={form.handleSubmit(onSubmitUpdate)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
