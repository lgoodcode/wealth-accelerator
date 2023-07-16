import { useEffect, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateAccount } from '../use-update-account';
import { updateAccountFormSchema, type UpdateAccountType } from '../schemas';
import type { Account } from '@/lib/plaid/types/institutions';

interface UpdateAccountDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  row: Row<Account>;
}

export function UpdateAccountDialog({ open, onOpenChange, row }: UpdateAccountDialogProps) {
  const updateAccount = useUpdateAccount();
  const queryClient = useQueryClient();
  const form = useForm<UpdateAccountType>({
    resolver: zodResolver(updateAccountFormSchema),
    values: {
      name: row.original.name,
      type: row.original.type,
      enabled: row.original.enabled,
    },
  });

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
    onSettled: () => onOpenChange(false),
  });

  const onSubmitUpdate = useCallback((data: UpdateAccountType) => mutate(data), [mutate]);

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
