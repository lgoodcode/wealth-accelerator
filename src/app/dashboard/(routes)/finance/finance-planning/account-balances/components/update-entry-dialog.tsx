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
import { useUpdateEntry } from '../hooks/entry/use-update-entry';
import { balanceEntrySchema, type BalanceEntrySchema } from '../../schema';
import type { BalancesEntry } from '@/lib/types/balances';

interface UpdateEntryDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  entry: BalancesEntry;
}

export function UpdateEntryDialog({ open, onOpenChange, entry }: UpdateEntryDialogProps) {
  const updateEntry = useUpdateEntry();
  const form = useForm<BalanceEntrySchema>({
    resolver: zodResolver(balanceEntrySchema),
    values: {
      ...entry,
      date: new Date(entry.date),
    },
  });

  const handleUpdate = async (data: BalanceEntrySchema) => {
    const date = new Date(data.date).toLocaleDateString();

    await updateEntry({
      ...entry,
      amount: data.amount,
      date: new Date(data.date).toUTCString(),
    })
      .then(() => {
        onOpenChange(false);
        toast.success(`Updated balance entry record for ${date}`);
      })
      .catch((error) => {
        console.error(error);
        captureException(error, {
          extra: { data },
        });
        toast.error('Failed to create balance entry record');
      });
  };

  useEffect(() => {
    form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Balance Entry</DialogTitle>
          <DialogDescription>
            Enter the date and amount deposited into your account.
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
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                onClick={form.handleSubmit(handleUpdate)}
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
