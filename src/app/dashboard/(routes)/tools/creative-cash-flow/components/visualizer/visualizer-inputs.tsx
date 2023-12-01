'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { supabase } from '@/lib/supabase/client';
import { PageError } from '@/components/page-error';
import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PercentInput } from '@/components/ui/percent-input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import type { WaaInfo } from '@/lib/types/waa-info';
import type { VisualizerTransactions } from '../../types';

interface VisualizerInputsProps {
  user_id: string;
  transactions: VisualizerTransactions;
  initial_WaaInfo: WaaInfo[];
}

const getWaaInfo = async (user_id: string) => {
  const { error, data } = await supabase
    .from('waa')
    .select('id, date, amount')
    .eq('user_id', user_id);

  if (error || !data) {
    throw error || new Error('No transactions returned');
  }

  return data as WaaInfo[];
};

export function VisualizerInputs({
  user_id,
  transactions,
  initial_WaaInfo,
}: VisualizerInputsProps) {
  const setVisualizeCcf = useSetAtom(visualizeCcfAtom);
  const form = useForm<VisualizerInputFormSchema>({
    resolver: zodResolver(visualizerInputFormSchema),
    defaultValues: {
      lifestyle_expenses_tax_rate: 25,
      tax_account_rate: 25,
    },
  });
  const {
    isError,
    isFetching,
    isRefetching,
    data: waaInfos,
  } = useQuery<WaaInfo[]>(['visualizer_waa'], () => getWaaInfo(user_id), {
    initialData: initial_WaaInfo,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const interval = form.watch('interval');
  const noTransactions = !transactions.business.length && !transactions.personal.length;
  const isDisabled = noTransactions || !interval;

  const handleSubmit = (data: VisualizerInputFormSchema) => {
    if (isDisabled) {
      return;
    }

    const results = visualizeCcf({
      ...data,
      business_transactions: transactions.business,
      personal_transactions: transactions.personal,
      waaInfos,
    });

    setVisualizeCcf(results);
  };

  useEffect(() => {
    if (noTransactions) {
      toast.error('No transactions found for the selected date range. Cannot visualize data.');
    }

    setVisualizeCcf([]);
  }, []);

  if (isError) {
    return <PageError />;
  } else if (isFetching) {
    return (
      <Loading title={isRefetching ? 'Refetching Data' : 'Fetching Data'} className="mt-0 py-32" />
    );
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The interval in which the calculations will be done.
                  </FormDescription>
                </FormItem>
              )}
            />
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
