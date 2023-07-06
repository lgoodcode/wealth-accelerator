'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { creativeCashFlowManagement } from '../functions/creative-cash-flow';
import { creativeCashFlowInputsAtom, creativeCashFlowResultAtom, isInputsOpenAtom } from '../atoms';
import { Transaction } from '@/lib/plaid/types/transactions';

export const inputsFormSchema = z
  .object({
    start_date: z.date({
      required_error: 'Select a date.',
    }),
    end_date: z.date({
      required_error: 'Select a data.',
    }),
    all_other_income: z.number({
      required_error: 'Enter a number.',
    }),
    payroll_and_distributions: z.number({
      required_error: 'Enter a number.',
    }),
    lifestyle_expenses_tax_rate: z
      .number({
        required_error: 'Enter a percentage.',
      })
      .min(0, 'Enter a positive percentage')
      .max(101, 'Enter a valid percentage'),
    tax_account_rate: z
      .number({
        required_error: 'Enter a percentage.',
      })
      .min(0, 'Enter a positive percentage')
      .max(101, 'Enter a valid percentage'),
    optimal_savings_strategy: z.number({
      required_error: 'Enter a number.',
    }),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: 'Start date must be before end date.',
    path: ['start_date'],
  });

export type InputsFormSchemaType = z.infer<typeof inputsFormSchema>;

interface InputsFormProps {
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
}

export function InputForm({ transactions }: InputsFormProps) {
  const [isInputsOpen, setIsInputsOpen] = useAtom(isInputsOpenAtom);
  const [creativeCashFlowInputs, setCreativeCashFlowInputs] = useAtom(creativeCashFlowInputsAtom);
  const setCreativeCashFlowResults = useSetAtom(creativeCashFlowResultAtom);
  const form = useForm<InputsFormSchemaType>({
    resolver: zodResolver(inputsFormSchema),
    defaultValues: creativeCashFlowInputs,
  });
  // Watch the values of the form to update the inputs atom when the form changes
  const watchValues = form.watch();

  // Calculate the results
  const onSubmit = async (data: InputsFormSchemaType) => {
    setCreativeCashFlowInputs(data);

    const result = creativeCashFlowManagement({
      ...data,
      business_transactions: transactions.business,
      personal_transactions: transactions.personal,
    });

    setCreativeCashFlowResults(result);
    setIsInputsOpen(false);
  };

  // Update the inputs when the inputs accordion is opening or closing
  useEffect(() => {
    setCreativeCashFlowInputs(watchValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputsOpen]);

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DatePicker className="w-full" date={field.value} onSelect={field.onChange} />
                <FormDescription>The day you want to start your strategy.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <DatePicker className="w-full" date={field.value} onSelect={field.onChange} />
                <FormDescription>The day you want to end your strategy.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="all_other_income"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  All Other Income<span className="ml-1 text-muted-foreground">(dollars)</span>
                </FormLabel>
                <NumberInput
                  placeholder="$30,000"
                  prefix="$"
                  value={field.value}
                  onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                />
                <FormDescription>
                  Any additional income that is not included from the transactions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payroll_and_distributions"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Payroll and Distributions to Self
                  <span className="ml-1 text-muted-foreground">(dollars)</span>
                </FormLabel>
                <NumberInput
                  placeholder="$100,000"
                  prefix="$"
                  value={field.value}
                  onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lifestyle_expenses_tax_rate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Lifestyle Expenses Tax Rate
                  <span className="ml-1 text-muted-foreground">(%)</span>
                </FormLabel>
                <NumberInput
                  placeholder="25%"
                  suffix="%"
                  value={field.value}
                  onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                />
                <FormDescription>The tax rate of purchases.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_account_rate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Tax Account Rate
                  <span className="ml-1 text-muted-foreground">(%)</span>
                </FormLabel>
                <NumberInput
                  placeholder="30%"
                  suffix="%"
                  value={field.value}
                  onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                />
                <FormDescription>The tax rate on business purchases.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="optimal_savings_strategy"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Optimal Savings Strategy
                  <span className="ml-1 text-muted-foreground">(dollars)</span>
                </FormLabel>
                <NumberInput
                  placeholder="$50,000"
                  prefix="$"
                  value={field.value}
                  onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                />
                <FormDescription>The amount of money you want to achieve.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              {/* <Button type="submit" loading={form.formState.isSubmitting}> */}
              Calculate
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
