'use client';

import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { Strategies } from '../strategies';
import { debtCalculationInputsAtom } from '../atoms';
import { debtCalculationSchema, type DebtCalculationSchemaType } from '../schema';
import { useDebtCalculate } from '../hooks/use-debt-calculate';
import type { Debt } from '@/lib/types/debts';
import { X } from 'lucide-react';

interface DebtSnowballInputsFormProps {
  paymentsSum: number;
  debts: Debt[];
}

export function DebtSnowballInputsForm({ paymentsSum, debts }: DebtSnowballInputsFormProps) {
  const inputs = useAtomValue(debtCalculationInputsAtom);
  const calculateDebt = useDebtCalculate(debts);
  const form = useForm<DebtCalculationSchemaType>({
    resolver: zodResolver(debtCalculationSchema),
    defaultValues: {
      monthly_payments: inputs?.monthly_payments ?? 0,
      snowball: paymentsSum,
      strategy: inputs?.strategy,
    },
  });

  useEffect(() => {
    form.setValue('snowball', paymentsSum + form.watch('monthly_payments'));
  }, [paymentsSum, form.watch('monthly_payments')]);

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(calculateDebt)} className="space-y-8">
        <FormField
          control={form.control}
          name="target_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Target date <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <div className="flex flex-row gap-3">
                <DatePicker
                  className="w-full"
                  date={field.value}
                  onSelect={field.onChange}
                  calendarProps={{
                    disabled: { before: new Date() },
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="px-2"
                  onClick={() => form.setValue('target_date', undefined)}
                >
                  <X />
                </Button>
              </div>
              <FormDescription>
                The month and year that you want to start the strategy. (The day will be ignored.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthly_payments"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Monthly payments <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <CurrencyInput
                placeholder="$500"
                prefix="$"
                onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                {...field}
                onChange={undefined}
              />
              <FormDescription>
                The amount of money you can put towards your debt each month.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snowball"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Initial snowball</FormLabel>
              <Input
                readOnly
                value={dollarFormatter(field.value, {
                  maximumFractionDigits: 0,
                })}
              />
              <FormDescription className="flex flex-col gap-1">
                <span>The amount of money you can put towards your debt each month.</span>
                <span>
                  (This value is derived from the &quot;Monthly payments&quot; field and the sum of
                  the &quot;payment&quot; from the debts.)
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Strategy</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {Object.values(Strategies).map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The strategy you want to use to pay off your debt.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
          Calculate
        </Button>
      </form>
    </Form>
  );
}
