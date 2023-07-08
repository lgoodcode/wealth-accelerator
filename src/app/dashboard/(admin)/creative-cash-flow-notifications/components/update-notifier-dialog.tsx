import { useCallback, useState } from 'react';
import { useSetAtom } from 'jotai';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { updateNotifiersAtom } from '../atoms';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  Dialog,
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
import { updateNotifierFormSchema, type UpdateNotifiersType } from '../schema';
import type { Notifier } from '../types';

const updateNotifier = async (id: number, data: UpdateNotifiersType) => {
  const { error, data: updatedNotifer } = await supabase
    .from('creative_cash_flow_notifiers')
    .update({
      email: data.email,
      enabled: data.enabled,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return updatedNotifer as Notifier;
};

interface UpdateNotifierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifier: Notifier;
}

export function UpdateNotifierDialog({ open, onOpenChange, notifier }: UpdateNotifierDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateNotifiers = useSetAtom(updateNotifiersAtom);
  const form = useForm<UpdateNotifiersType>({
    resolver: zodResolver(updateNotifierFormSchema),
    values: {
      email: notifier.email,
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

  const handleUpdate = async (data: UpdateNotifiersType) => {
    setIsUpdating(true);

    updateNotifier(notifier.id, data)
      .then((updatedNotifier) => {
        updateNotifiers(updatedNotifier);
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={isUpdating}
            onClick={() => handleUpdateDialogOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isUpdating} onClick={form.handleSubmit(handleUpdate)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
