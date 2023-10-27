'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PercentInput } from '@/components/ui/percent-input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { inputLabels } from '../../labels';
import { visualizerInputFormSchema, type VisualizerInputFormSchema } from '../../schema';
import { visualizeCcfAtom } from '../../atoms';
import { visualizeCcf } from '../../functions/creative-cash-flow-visualizer';
import type { CcfTransaction } from '../../types';

interface VisualizerInputsProps {
  transactions: {
    business: CcfTransaction[];
    personal: CcfTransaction[];
  };
}

export function VisualizerInputs({ transactions }: VisualizerInputsProps) {
  const setVisualizeCcf = useSetAtom(visualizeCcfAtom);
  const form = useForm<VisualizerInputFormSchema>({
    resolver: zodResolver(visualizerInputFormSchema),
    defaultValues: {
      lifestyle_expenses_tax_rate: 25,
      tax_account_rate: 25,
    },
  });
  const isDisabled = !transactions.business.length && !transactions.personal.length;

  const handleSubmit = (data: VisualizerInputFormSchema) => {
    if (isDisabled) {
      return;
    }

    console.log({ data });

    const results = visualizeCcf({
      ...data,
      business_transactions: transactions.business,
      personal_transactions: transactions.personal,
    });

    console.log({ results });

    setVisualizeCcf(results);
  };

  useEffect(() => {
    if (isDisabled) {
      toast.error('No transactions found for the selected date range. Cannot visualize data.');
    }
  }, []);

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.start_date.title}</FormLabel>
                  <DatePicker
                    className="w-full"
                    date={field.value}
                    onSelect={field.onChange}
                    disabled={isDisabled}
                  />
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
                  <DatePicker
                    className="w-full"
                    date={field.value}
                    onSelect={field.onChange}
                    disabled={isDisabled}
                  />
                  <FormDescription>{inputLabels.end_date.description}</FormDescription>
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
                  <PercentInput placeholder="25%" {...field} disabled={isDisabled} />
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
                  <PercentInput placeholder="25%" {...field} disabled={isDisabled} />
                  <FormDescription>{inputLabels.tax_account_rate.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full"
                disabled={isDisabled}
                loading={form.formState.isSubmitting}
              >
                Calculate
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
