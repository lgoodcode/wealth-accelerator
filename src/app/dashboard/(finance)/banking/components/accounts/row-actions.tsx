'use client';

import { z } from 'zod';
import { useState, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { MoreHorizontal, Pen } from 'lucide-react';
import type { Row } from '@tanstack/react-table';

import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Account } from '@/lib/plaid/types/institutions';

const updateAccountFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this account.',
  }),
  type: z.enum(['personal', 'business'], {
    required_error: 'Please select a type for this account.',
  }),
  enabled: z.boolean({
    required_error: 'Please select whether this account is enabled or not.',
  }),
});

type UpdateAccountType = z.infer<typeof updateAccountFormSchema>;

const updateAccount = async (account_id: string, data: UpdateAccountType) => {
  const { error, data: updatedAccount } = await supabase
    .from('plaid_accounts')
    .update({
      name: data.name,
      type: data.type,
      enabled: data.enabled,
    })
    .eq('account_id', account_id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return updatedAccount as Account;
};

interface RowActionsProps {
  row: Row<Account>;
}

export function RowActions({ row }: RowActionsProps) {
  const queryClient = useQueryClient();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const form = useForm<UpdateAccountType>({
    resolver: zodResolver(updateAccountFormSchema),
    values: {
      name: row.original.name,
      type: row.original.type,
      enabled: row.original.enabled,
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
    mutationFn: (data: UpdateAccountType) => updateAccount(row.original.account_id, data),
    onError: (error) => {
      console.error(error);
      captureException(error);
      toast.error('An error occurred while updating the account');
    },
    onSuccess: (updatedAccount) => {
      queryClient.setQueryData<Account[]>(['accounts', row.original.item_id], (oldAccounts) => {
        if (oldAccounts) {
          return oldAccounts.map((account) => {
            if (account.account_id === updatedAccount.account_id) {
              return updatedAccount;
            }
            return account;
          });
        }
        return oldAccounts;
      });
    },
    onSettled: handleCloseUpdateDialog,
  });

  const onSubmitUpdate = useCallback((data: UpdateAccountType) => mutate(data), [mutate]);

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
            <DialogTitle>Update account</DialogTitle>
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
                      <Input placeholder="Account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Enabled</FormLabel>
                    <FormControl>
                      <Checkbox
                        className="w-6 h-6"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
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
