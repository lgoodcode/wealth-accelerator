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
  DialogClose,
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
import { useCreateAccount } from '../hooks/use-create-account';
import { accountSchema, type AccountSchema } from '../schema';

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
}

export function CreateAccountDialog({ open, onOpenChange }: CreateAccountDialogProps) {
  const createAccount = useCreateAccount();
  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
  });

  const handleCreate = async ({ name }: AccountSchema) => {
    await createAccount(name)
      .then((newName) => {
        onOpenChange(false);
        toast.success(
          <span>
            Created account <span className="font-bold">{newName}</span>
          </span>
        );
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
        toast.error('Failed to create account');
      });
  };

  useEffect(() => {
    form.reset();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>Set a name for this account.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleCreate)}>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" disabled={form.formState.isSubmitting}>
                  Close
                </Button>
              </DialogClose>
              <Button
                loading={form.formState.isSubmitting}
                onClick={form.handleSubmit(handleCreate)}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
