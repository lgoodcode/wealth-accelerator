import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { CustomError } from '@/lib/utils/CustomError';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { accountSchema, type AccountSchema } from '../../schema';
import { useRenameAccount } from '../hooks/account/use-rename-account';
import type { BalancesAccount } from '@/lib/types/balances';

interface RenameAccountDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  account: BalancesAccount | null;
}

export function RenameAccountDialog({ open, onOpenChange, account }: RenameAccountDialogProps) {
  const renameAccount = useRenameAccount();
  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
  });

  const handleRename = async ({ name }: AccountSchema) => {
    if (!account) {
      return;
    }

    await renameAccount(account, name)
      .then(() => {
        toast.success('Account renamed');
        onOpenChange(false);
      })
      .catch((error) => {
        if (error instanceof CustomError) {
          form.setError('name', {
            type: 'manual',
            message: error.message,
          });
          return;
        }

        console.error(error);
        captureException(error);
        toast.error('Failed to rename account');
      });
  };

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Account</DialogTitle>
          <DialogDescription>Set a new name for this account.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleRename)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New name</FormLabel>
                  <FormControl>
                    <Input placeholder="Account name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={form.formState.isSubmitting}>
              Close
            </Button>
          </DialogClose>
          <Button loading={form.formState.isSubmitting} onClick={form.handleSubmit(handleRename)}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
