import { useEffect, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import type { Row } from '@tanstack/react-table';

import { CustomError } from '@/lib/utils/CustomError';
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
import { useUpdateAccount } from '../../hooks/use-update-account';
import { updateAccountFormSchema, type UpdateAccountForm } from '../../schema';
import type { Account } from '@/lib/plaid/types/institutions';

interface UpdateAccountDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  row: Row<Account>;
}

export function UpdateAccountDialog({ open, onOpenChange, row }: UpdateAccountDialogProps) {
  const updateAccount = useUpdateAccount();
  const queryClient = useQueryClient();
  const form = useForm<UpdateAccountForm>({
    resolver: zodResolver(updateAccountFormSchema),
    values: { ...row.original },
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: UpdateAccountForm) => {
      // If the data is the same, don't make the request
      if (
        data.name === row.original.name &&
        data.type === row.original.type &&
        data.enabled === row.original.enabled
      ) {
        return Promise.resolve(row.original);
      }

      // Check if the user is attempting to set a second WAA account
      if (data.type === 'waa' && row.original.type !== 'waa') {
        const cache = queryClient.getQueryData<Account[]>(['accounts', row.original.item_id]);

        if (
          cache?.some(
            (account) => account.type === 'waa' && account.account_id !== row.original.account_id
          )
        ) {
          throw new CustomError('Only one WAA account is allowed per institution');
        }
      }

      return updateAccount(row.original.account_id, data);
    },
    onError: (error: Error | CustomError) => {
      if (error instanceof CustomError) {
        form.setError(error.code === 'DUPLICATE_ACCOUNT_NAME' ? 'name' : 'type', {
          type: 'manual',
          message: error.message,
        });
        return;
      }

      onOpenChange(false);
      console.error(error);
      captureException(error);
      toast.error('An error occurred while updating the account');
    },
    onSuccess: (updatedAccount) => {
      // If the enabled status has changed then invalidate the query cache for the
      // transactions so that they are refetched (if an account is disabled, omit those transactions)
      if (row.original.enabled !== updatedAccount.enabled) {
        queryClient.invalidateQueries(['transactions', row.original.item_id]);
      }
      // Mutate the query cache for the accounts so that the updated account is reflected
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

      onOpenChange(false);
    },
  });

  const onSubmitUpdate = useCallback((data: UpdateAccountForm) => mutate(data), [mutate]);

  useEffect(() => {
    form.reset();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Account</DialogTitle>
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
                        <SelectItem value="waa">WAA</SelectItem>
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
