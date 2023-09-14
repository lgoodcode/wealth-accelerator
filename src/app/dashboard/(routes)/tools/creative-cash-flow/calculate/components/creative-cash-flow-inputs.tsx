'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import { PercentInput } from '@/components/ui/percent-input';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { inputLabels } from '../../labels';
import { creativeCashFlowManagement } from '../functions/creative-cash-flow';
import { getTotalWAA } from '../functions/get-total-waa';
import { creativeCashFlowInputsAtom, creativeCashFlowResultAtom } from '../../atoms';
import { inputsFormSchema, type InputsFormSchemaType } from '../schema';
import type { Transaction } from '@/lib/plaid/types/transactions';

interface CcfInputsFormProps {
  userId: string;
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
  ytd_collections: number;
  default_tax_rate: number;
}

export function CreativeCashFlowInputs({
  userId,
  transactions,
  ytd_collections,
  default_tax_rate,
}: CcfInputsFormProps) {
  const [creativeCashFlowInputs, setCreativeCashFlowInputs] = useAtom(creativeCashFlowInputsAtom);
  const setCreativeCashFlowResults = useSetAtom(creativeCashFlowResultAtom);
  const form = useForm<InputsFormSchemaType>({
    resolver: zodResolver(inputsFormSchema),
    defaultValues: {
      ...creativeCashFlowInputs,
      tax_account_rate: creativeCashFlowInputs.tax_account_rate || default_tax_rate,
    },
  });

  const calculate = async (data: InputsFormSchemaType) => {
    if (!transactions.business.length && !transactions.personal.length) {
      toast.error(
        'There are no transactions to calculate the Creative Cash Flow. Please check your bank accounts.'
      );
      return;
    }

    // Wait 1 second to simulate a loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const total_waa = await getTotalWAA(userId, data.start_date);

    if (total_waa === null) {
      toast.error(
        <span>
          There was an error calculating the <span className="font-bold">Total WAA</span>.
        </span>
      );
    }

    setCreativeCashFlowInputs(data);

    const result = creativeCashFlowManagement({
      ...data,
      ytd_collections,
      total_waa: total_waa || 0,
      business_transactions: transactions.business,
      personal_transactions: transactions.personal,
    });
    setCreativeCashFlowResults(result);
  };

  return (
    <Card className="w-[480px] mx-auto">
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(calculate)} className="space-y-8">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.start_date.title}</FormLabel>
                  <DatePicker className="w-full" date={field.value} onSelect={field.onChange} />
                  <FormDescription>{inputLabels.start_date.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.end_date.title}</FormLabel>
                  <DatePicker className="w-full" date={field.value} onSelect={field.onChange} />
                  <FormDescription>{inputLabels.end_date.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="all_other_income"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.all_other_income.title}</FormLabel>
                  <CurrencyInput placeholder="$100,000" {...field} />
                  <FormDescription>{inputLabels.all_other_income.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payroll_and_distributions"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.payroll_and_distributions.title}</FormLabel>
                  <CurrencyInput placeholder="$100,000" {...field} />
                  <FormDescription>
                    {inputLabels.payroll_and_distributions.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lifestyle_expenses_tax_rate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.lifestyle_expenses_tax_rate.title}</FormLabel>
                  <PercentInput placeholder="25%" {...field} />
                  <FormDescription>
                    {inputLabels.lifestyle_expenses_tax_rate.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax_account_rate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.tax_account_rate.title}</FormLabel>
                  <PercentInput placeholder="25%" {...field} />
                  <FormDescription>{inputLabels.tax_account_rate.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="optimal_savings_strategy"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.optimal_savings_strategy.title}</FormLabel>
                  <CurrencyInput placeholder="$50,000" {...field} />
                  <FormDescription>
                    {inputLabels.optimal_savings_strategy.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
                Calculate
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
