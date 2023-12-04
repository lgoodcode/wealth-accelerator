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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateNotifier } from '../hooks/use-update-notifier';
import { notifierFormSchema, type NotifierForm } from '../schema';
import type { Notifier } from '@/lib/types/notifier';

interface UpdateNotifierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifier: Notifier;
}

export function UpdateNotifierDialog({ open, onOpenChange, notifier }: UpdateNotifierDialogProps) {
  const updateNotifier = useUpdateNotifier();
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<NotifierForm>({
    resolver: zodResolver(notifierFormSchema),
    values: notifier,
  });

  const handleUpdateDialogOpenChange = useCallback(
    (open: boolean) => {
      form.reset();
      onOpenChange(open);
    },
    [form]
  );

  const handleUpdate = async (data: NotifierForm) => {
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
          <DialogTitle>Update Notifier</DialogTitle>
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
              name="contact_email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div>
                    <FormLabel>Contact Email</FormLabel>
                    <FormDescription>Notifies when a user submits a contact form.</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      id="contact-email"
                      name={field.name}
                      className="w-6 h-6"
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creative_cash_flow"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div>
                    <FormLabel>Creative Cash Flow</FormLabel>
                    <FormDescription>
                      Notifies when a user shares a Creative Cash Flow record.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      id="creative-cash-flow"
                      name={field.name}
                      className="w-6 h-6"
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="debt_snowball"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div>
                    <FormLabel>Debt Snowball</FormLabel>
                    <FormDescription>
                      Notifies when a user shares a Debt Snowball record.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      id="debt-snowball"
                      name={field.name}
                      className="w-6 h-6"
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
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
