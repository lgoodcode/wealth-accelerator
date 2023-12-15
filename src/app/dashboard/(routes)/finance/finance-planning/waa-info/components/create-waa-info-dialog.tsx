import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { VISUALIZER_WAA_KEY } from '@/config/constants/react-query';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
  Dialog,
  DialogTrigger,
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
import { useCreateWaaInfo } from '../../hooks/use-create-waa-info';
import { waaInfoSchema, type WaaInfoSchema } from '../../schema';

export function CreateWaaInfoDialog() {
  const createWaaInfo = useCreateWaaInfo();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<WaaInfoSchema>({
    resolver: zodResolver(waaInfoSchema),
  });

  const handleCreate = async (data: WaaInfoSchema) => {
    const date = new Date(data.date).toLocaleDateString();
    await createWaaInfo(data)
      .then(() => {
        setIsOpen(false);
        toast.success(`Created WAA record for ${date}`);
        queryClient.invalidateQueries({ queryKey: [VISUALIZER_WAA_KEY] });
      })
      .catch((error) => {
        console.error(error);
        captureException(error, {
          extra: { data },
        });
        toast.error('Failed to create WAA record');
      });
  };

  useEffect(() => {
    form.reset();
  }, [form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 px-2 lg:px-3">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create WAA
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create WAA</DialogTitle>
          <DialogDescription>
            Enter the date and amount deposited into your WAA account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleCreate)}>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    className="w-full"
                    date={field.value}
                    onSelect={field.onChange}
                    calendarProps={{
                      disabled: {
                        after: new Date(),
                      },
                    }}
                  />
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
