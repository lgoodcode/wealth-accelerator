import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogTrigger,
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
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { useCreateDebt } from '../hooks/use-create-debt';
import { debtFormSchema, DebtForm } from '../schema';
import { CurrencyInput } from '@/components/ui/currency-input';
import { PercentInput } from '@/components/ui/percent-input';

export function CreateDebtDialog() {
  const createDebt = useCreateDebt();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<DebtForm>({
    resolver: zodResolver(debtFormSchema),
  });

  const handleCreate = async (data: DebtForm) => {
    await createDebt(data)
      .then(() => {
        setIsOpen(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Failed to create debt');
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
          Create Debt
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Debt</DialogTitle>
          <DialogDescription>Create a new debt to manage.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleCreate)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Mortgage" {...field} />
                  </FormControl>
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
                  <FormDescription>The amount of money owed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment</FormLabel>
                  <FormControl>
                    <CurrencyInput placeholder="$450" {...field} />
                  </FormControl>
                  <FormDescription>The monthly payment amount.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest</FormLabel>
                  <FormControl>
                    <PercentInput placeholder="22.29%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="months_remaining"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Months Remaining
                    <span className="ml-1 text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The number of months required to pay the principal within.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" disabled={form.formState.isSubmitting}>
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
