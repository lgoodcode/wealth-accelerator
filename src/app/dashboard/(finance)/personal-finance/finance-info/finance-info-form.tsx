'use client';

import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { NumberInput } from '@/components/ui/number-input';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateFinanceInfo } from '../use-update-finance-info';
import { FinanceInfoSchema, type FinanceInfoSchemaType as FinanceInfoSchemaType } from '../schema';

// Override the type for the start_date because Supabase returns a string.
interface FinanceInfoFormProps {
  user: User;
  initialValues?: Omit<FinanceInfoSchemaType, 'start_date'> & {
    start_date: Date | string;
  };
}

export function FinanceInfoForm({ user, initialValues }: FinanceInfoFormProps) {
  const updateFinanceInfo = useUpdateFinanceInfo();
  const form = useForm<FinanceInfoSchemaType>({
    resolver: zodResolver(FinanceInfoSchema),
    defaultValues: {
      ...initialValues,
      start_date: initialValues?.start_date ? new Date(initialValues.start_date) : undefined,
    },
  });

  const onSubmit = async (data: FinanceInfoSchemaType) => {
    updateFinanceInfo(user.id, data)
      .then(() => {
        toast.success('Your information has been saved');
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Uh oh! Something went wrong. Please try again.');
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Strategy Start Date</FormLabel>
              <DatePicker className="w-full" date={field.value} onSelect={field.onChange} />
              <FormDescription>
                The month and year that you want to start comparing the strategy timeframe.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stop_invest"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Stop Invest <span className="ml-1 text-muted-foreground">(year)</span>
              </FormLabel>
              <NumberInput
                placeholder="10"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>The number of years that you want to invest for.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_withdrawl"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Start Withdrawl<span className="ml-1 text-muted-foreground">(year)</span>
              </FormLabel>
              <NumberInput
                placeholder="15"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>
                The number of years to wait after stopped investing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="money_needed_to_live"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Money Needed To Live
                <span className="ml-1 text-muted-foreground">(dollars)</span>
              </FormLabel>
              <NumberInput
                placeholder="$100,000"
                prefix="$"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>
                Index Fund ROR Needed to Equal Life Insurance Income Distributions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tax_bracket"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Tax Bracket
                <span className="ml-1 text-muted-foreground">(%)</span>
              </FormLabel>
              <NumberInput
                placeholder="25%"
                suffix="%"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>Your current tax bracket.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tax_bracket_future"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Future Tax Bracket
                <span className="ml-1 text-muted-foreground">(%)</span>
              </FormLabel>
              <NumberInput
                placeholder="30%"
                suffix="%"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>Your future predicted tax bracket.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="premium_deposit"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Premium Deposit
                <span className="ml-1 text-muted-foreground">(dollars)</span>
              </FormLabel>
              <NumberInput
                placeholder="$50,000"
                prefix="$"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>
                The amount of money you want to deposit into your life insurance policy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ytd_collections"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Year to Date Collections
                <span className="ml-1 text-muted-foreground">(dollars)</span>
              </FormLabel>
              <NumberInput
                placeholder="$25,000"
                prefix="$"
                value={field.value}
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
              />
              <FormDescription>
                The amount of money you want you have that is not included in the transactions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={form.formState.isSubmitting}>
          Save changes
        </Button>
      </form>
    </Form>
  );
}
