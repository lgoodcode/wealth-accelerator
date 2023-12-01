import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateWaaInfo } from '../../hooks/use-update-waa-info';
import { waaInfoSchema, type WaaInfoSchema } from '../../schema';
import type { WaaInfo } from '@/lib/types/waa-info';

interface UpdateWaaInfoDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  record: WaaInfo;
}

export function UpdateWaaInfoDialog({ open, onOpenChange, record }: UpdateWaaInfoDialogProps) {
  const updateWaaInfo = useUpdateWaaInfo();
  const form = useForm<WaaInfoSchema>({
    resolver: zodResolver(waaInfoSchema),
    values: {
      ...record,
      date: new Date(record.date),
    },
  });
  const date = new Date(record.date).toLocaleDateString();

  const handleUpdate = async (data: WaaInfoSchema) => {
    await updateWaaInfo(record.id, data)
      .then(() => {
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error, {
          extra: { id: record.id, data },
        });
        toast.error(
          <span>
            Failed to update WAA record for <span className="font-bold">{date}</span>
          </span>
        );
      });
  };

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update WAA</DialogTitle>
          <DialogDescription>
            Update WAA record for <span className="font-bold">{date}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdate)}>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker className="w-full" date={field.value} onSelect={field.onChange} />
                  <FormDescription>Select the date you made the deposit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput placeholder="$5,000" {...field} />
                  </FormControl>
                  <FormDescription>The amount desposited.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
