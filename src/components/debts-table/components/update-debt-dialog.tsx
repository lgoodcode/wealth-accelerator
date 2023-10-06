import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { captureException } from '@sentry/nextjs';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateDebt } from '../hooks/use-update-debt';
import { debtFormSchema, type DebtForm } from '../schema';
import type { Debt } from '@/lib/types/debts';

interface UpdateDebtDialogProps {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  debt: Debt;
}

export function UpdateDebtDialog({ open, onOpenChange, debt }: UpdateDebtDialogProps) {
  const updateDebt = useUpdateDebt();
  const form = useForm<DebtForm>({
    resolver: zodResolver(debtFormSchema),
    values: debt,
  });

  const handleUpdate = async (data: DebtForm) => {
    await updateDebt(debt.id, data)
      .then(() => {
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error(
          <span>
            Failed to update debt <span className="font-bold">{debt.description}</span>
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
          <DialogTitle>Update Debt</DialogTitle>
          <DialogDescription>
            Update <span className="font-bold">{debt.description}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdate)}>
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
                  <FormLabel>
                    Amount
                    <span className="ml-1 text-muted-foreground">($)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="$5,000"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
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
                  <FormLabel>
                    Payment
                    <span className="ml-1 text-muted-foreground">($)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="$450"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
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
                  <FormLabel>
                    Interest
                    <span className="ml-1 text-muted-foreground">(%)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="22.29%"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
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
                    <span className="ml-1 text-muted-foreground">(months)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The number of months required to pay the principal within.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={form.formState.isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            onClick={form.handleSubmit(handleUpdate)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
