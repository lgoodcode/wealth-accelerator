import { useCallback, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { useUpdateNotifier } from '../hooks/use-update-notifier';
import { notifierFormSchema, type NotifierFormType } from '../schema';
import type { Notifier } from '../types';

interface UpdateNotifierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifier: Notifier;
}

export function UpdateNotifierDialog({ open, onOpenChange, notifier }: UpdateNotifierDialogProps) {
  const updateNotifier = useUpdateNotifier();
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<NotifierFormType>({
    resolver: zodResolver(notifierFormSchema),
    values: {
      name: notifier.name,
      email: notifier.email.toLowerCase(),
      enabled: notifier.enabled,
    },
  });

  const handleUpdateDialogOpenChange = useCallback(
    (open: boolean) => {
      form.reset();
      onOpenChange(open);
    },
    [form]
  );

  const handleUpdate = async (data: NotifierFormType) => {
    setIsUpdating(true);

    await updateNotifier(notifier.id, data)
      .then(() => {
        handleUpdateDialogOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Error updating notifier');
      })
      .finally(() => setIsUpdating(false));
  };

  return (
    <Dialog open={open} onOpenChange={handleUpdateDialogOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update notifier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" disabled={isUpdating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button loading={isUpdating}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
