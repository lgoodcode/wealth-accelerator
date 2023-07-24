'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

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
import { snowballCalculation } from '../functions/debt-snowball';
import { debtCalculationSchema, type DebtCalculationSchemaType } from '../schema';
import type { Debt } from '@/lib/types/debts';

interface DebtSnowballInputsFormProps {
  paymentsSum: number;
  debts: Debt[];
}

export function DebtSnowballInputsForm({ paymentsSum, debts }: DebtSnowballInputsFormProps) {
  const form = useForm<DebtCalculationSchemaType>({
    resolver: zodResolver(debtCalculationSchema),
    defaultValues: {
      monthly_payments: 0,
      snowball: paymentsSum,
    },
  });

  useEffect(() => {
    form.setValue('snowball', paymentsSum + form.watch('monthly_payments'));
  }, [paymentsSum, form.watch('monthly_payments')]);

  const calculate = (data: DebtCalculationSchemaType) => {
    let sorted_debts: Debt[];

    if (data.strategy === Strategies.DebtSnowball || data.strategy === Strategies.LowestBalance) {
      sorted_debts = debts.sort((a, b) => a.amount - b.amount);
    } else if (data.strategy === Strategies.HighestBalance) {
      sorted_debts = debts.sort((a, b) => b.amount - a.amount);
    } else if (data.strategy === Strategies.HighestInterest) {
      sorted_debts = debts.sort((a, b) => b.interest - a.interest);
    } else if (data.strategy === Strategies.LowestInterest) {
      sorted_debts = debts.sort((a, b) => a.interest - b.interest);
    } else {
      console.error('Invalid strategy', data.strategy);
      toast.error('Invalid strategy');
      return;
    }

    try {
      const results = snowballCalculation(data.snowball, sorted_debts, data.target_date);
      console.log(results);
    } catch (error: any) {
      if (error.cause === 'interest') {
        toast.error('A debt has a prinicipal and interest rate that exceeds the snowball amount.');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(calculate)} className="space-y-8">
        <FormField
          control={form.control}
          name="target_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Target date <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <DatePicker
                className="w-full"
                date={field.value}
                onSelect={field.onChange}
                calendarProps={{
                  disabled: { before: new Date() },
                }}
              />
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

        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}
