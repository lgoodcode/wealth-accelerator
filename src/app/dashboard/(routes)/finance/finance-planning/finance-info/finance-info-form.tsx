'use client';

import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
import { PercentInput } from '@/components/ui/percent-input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateFinanceInfo } from '../hooks/use-update-finance-info';
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
    values: {
      ...initialValues,
      // @ts-ignore
      start_date: initialValues?.start_date ? new Date(initialValues.start_date) : undefined,
    },
  });

  const onSubmit = async (data: FinanceInfoSchemaType) => {
    await updateFinanceInfo(user.id, data)
      .then((data) => {
        toast.success('Your information has been saved');
        form.reset(data);
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Uh oh! Something went wrong. Please try again.');
      });
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Strategy Start Date</FormLabel>
                  <DatePicker
                    className="w-full"
                    date={field.value}
                    onSelect={field.onChange}
                    calendarProps={{
                      disabled: { before: new Date() },
                    }}
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
              render={({ field: { onChange, ...field } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Stop Invest <span className="ml-1 text-muted-foreground">(year)</span>
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="10"
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    {...field}
                  />
                  <FormDescription>
                    The number of years that you want to invest for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_withdrawl"
              render={({ field: { onChange, ...field } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Start Withdrawl<span className="ml-1 text-muted-foreground">(year)</span>
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="15"
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    {...field}
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
                  <FormLabel>Money Needed To Live</FormLabel>
                  <CurrencyInput placeholder="$100,000" decimals={false} {...field} />
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
                  <FormLabel>Tax Bracket</FormLabel>
                  <PercentInput placeholder="25%" {...field} />
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
                  <FormLabel>Future Tax Bracket</FormLabel>
                  <PercentInput placeholder="30%" {...field} />
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
                  <FormLabel>Premium Deposit</FormLabel>
                  <CurrencyInput placeholder="$20,000" decimals={false} {...field} />
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
                  <FormLabel>Year to Date Collections</FormLabel>
                  <CurrencyInput placeholder="$30,000" decimals={false} {...field} />
                  <FormDescription>
                    The amount of money you want you have that is not included in the transactions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="default_tax_rate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Default Tax Bracket</FormLabel>
                  <PercentInput placeholder="25%" {...field} />
                  <FormDescription>Default tax account rate for the CCF inputs.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isDirty}
            >
              Save changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
