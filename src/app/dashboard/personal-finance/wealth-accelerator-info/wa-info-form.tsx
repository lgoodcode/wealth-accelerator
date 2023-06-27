'use client';

import * as z from 'zod';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NumberInput } from '@/components/ui/number-input';

const WaInfoFormSchema = z.object({
  start_date: z.date({
    required_error: 'Select a date.',
  }),
  stop_invest: z
    .number({
      required_error: 'Enter the year',
    })
    .min(1, 'Enter a number greater than 0')
    .max(100, 'Enter a number less than 100'),
  start_withdrawl: z
    .number({
      required_error: 'Enter the year',
    })
    .min(1, 'Enter a number greater than 0')
    .max(100, 'Enter a number less than 100'),
  money_needed_to_live: z
    .number({
      required_error: 'Enter the amount',
    })
    .min(1, 'Enter an amount greater than 0'),
  tax_bracket: z
    .number({
      required_error: 'Enter the tax bracket percentage',
    })
    .min(0, 'Enter a positive percentage')
    .max(101, 'Enter a valid percentage'),
  tax_bracket_future: z
    .number({
      required_error: 'Enter the tax bracket percentage',
    })
    .min(0, 'Enter a positive percentage')
    .max(101, 'Enter a valid percentage'),
  premium_deposit: z
    .number({
      required_error: 'Enter the amount',
    })
    .min(1, 'Enter an amount greater than 0'),
});

export type WaInfoFormType = z.infer<typeof WaInfoFormSchema>;

// Override the type for the start_date because Supabase returns a string.
interface WaInfoFormProps {
  initialValues?: Omit<WaInfoFormType, 'start_date'> & {
    start_date: Date | string;
  };
}

export function WaInfoForm({ initialValues }: WaInfoFormProps) {
  const user = useUser();
  const form = useForm<WaInfoFormType>({
    resolver: zodResolver(WaInfoFormSchema),
    defaultValues: {
      ...initialValues,
      start_date: initialValues?.start_date ? new Date(initialValues.start_date) : undefined,
    },
  });

  const onSubmit = async (formData: WaInfoFormType) => {
    const { error } = await supabase
      .from('personal_finance')
      .update({
        ...formData,
        start_date: formData.start_date.toUTCString(),
      })
      .eq('user_id', user!.id);

    if (error) {
      console.error(error);
      captureException(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please try again.',
      });
      return;
    }

    toast({
      variant: 'success',
      title: 'Success!',
      description: 'Your information has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.log)} className="space-y-8">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Strategy Start Date</FormLabel>
              <DatePicker
                initialDate={field.value}
                onSelect={field.onChange}
                className="w-full"
                {...field}
              />
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
              <NumberInput placeholder="Number of years" className="w-auto" {...field} />
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
              <NumberInput placeholder="Number of years" className="w-auto" {...field} />
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
              <NumberInput placeholder="$100,000" prefix="$" className="w-auto" {...field} />
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
                <span className="ml-1 text-muted-foreground">(percentage)</span>
              </FormLabel>
              <NumberInput placeholder="25%" suffix="%" className="w-auto" {...field} />
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
                <span className="ml-1 text-muted-foreground">(percentage)</span>
              </FormLabel>
              <NumberInput placeholder="30%" suffix="%" className="w-auto" {...field} />
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
              <NumberInput placeholder="$50,000" prefix="$" className="w-auto" {...field} />
              <FormDescription>
                The amount of money you want to deposit into your life insurance policy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}
