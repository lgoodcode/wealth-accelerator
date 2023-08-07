'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue, useSetAtom } from 'jotai';
import { Plus, X } from 'lucide-react';

import { dollarFormatter } from '@/lib/utils/dollar-formatter';
import { moneyRound } from '@/lib/utils/money-round';
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
import { Checkbox } from '@/components/ui/checkbox';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { debtCalculationInputsAtom, sortDebtsAtom } from '../atoms';
import { Strategies } from '../strategies';
import { useDebtCalculate } from '../hooks/use-debt-calculate';
import { debtCalculationSchema, type DebtCalculationSchemaType } from '../schema';
import type { Debt } from '@/lib/types/debts';

interface DebtSnowballInputsFormProps {
  debts: Debt[];
}

export function DebtSnowballInputsForm({ debts }: DebtSnowballInputsFormProps) {
  const inputs = useAtomValue(debtCalculationInputsAtom);
  const paymentsSum = debts.reduce((a, b) => a + b.payment, 0);
  const calculateDebt = useDebtCalculate();
  const sortDebts = useSetAtom(sortDebtsAtom);
  const [numLumps, setNumLumps] = useState(1);
  const form = useForm<DebtCalculationSchemaType>({
    resolver: zodResolver(debtCalculationSchema),
    resetOptions: {
      keepValues: true,
    },
    values: {
      ...inputs,
      // @ts-ignore - Default to undefined to make the user select a strategy
      strategy: inputs?.strategy ?? undefined,
      monthly_payment: paymentsSum,
      opportunity_rate: inputs?.opportunity_rate ?? 5,
      lump_amounts: inputs?.lump_amounts ?? [0],
      pay_back_loan: inputs?.pay_back_loan ?? false,
      pay_interest: inputs?.pay_interest ?? false,
      loan_interest_rate: inputs?.loan_interest_rate ?? 5,
    },
  });
  const strategy = form.watch('strategy');
  const additional_payment = form.watch('additional_payment');
  const shouldDisplayWealthAccelerator = strategy?.includes('Wealth Accelerator');
  const canPayBackLoan = Boolean(form.watch('lump_amounts')?.reduce((a, b) => a + b, 0));

  const addLump = () => {
    const lump_amounts = form.getValues('lump_amounts') as (number | undefined)[];
    lump_amounts.push(undefined);
    // @ts-ignore
    form.setValue('lump_amounts', lump_amounts);
    setNumLumps(numLumps + 1);
  };

  const removeLump = (index: number) => {
    const lump_amounts = form.getValues('lump_amounts') as number[];
    lump_amounts.splice(index, 1);
    form.setValue('lump_amounts', lump_amounts);
    setNumLumps(numLumps - 1);
  };

  // Update the monthly payment when the additional payment changes
  useEffect(() => {
    form.setValue('monthly_payment', paymentsSum + (additional_payment ?? 0));
  }, [paymentsSum, additional_payment]);

  // Reset the lump amounts whenever the strategy changes and isn't a Wealth Accelerator strategy
  useEffect(() => {
    if (!shouldDisplayWealthAccelerator) {
      form.setValue('lump_amounts', [0]);
      setNumLumps(1);
    }
  }, [strategy]);

  // Sort the debts when the strategy changes so it is displayed in the table and ready to
  // be calculated. The sorting won't affect the "current" strategy because the snowball isn't used
  useEffect(() => {
    sortDebts(strategy);
  }, [strategy]);

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(calculateDebt)}>
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-6 space-y-8">
              <FormField
                control={form.control}
                name="additional_payment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Additional monthly payment{' '}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <CurrencyInput
                      placeholder="$500"
                      prefix="$"
                      onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                      {...field}
                      onChange={undefined}
                    />
                    <FormDescription>
                      Additional amount of money you can put towards your debt each month.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_payment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Current monthly payment</FormLabel>
                    <Input
                      readOnly
                      value={dollarFormatter(field.value, {
                        maximumFractionDigits: 0,
                      })}
                    />
                    <FormDescription className="flex flex-col gap-1">
                      <span>The amount of money you can put towards your debt each month.</span>
                      <span>
                        (This value is derived from the &quot;Additional monthly payments&quot;
                        field and the sum of the &quot;payment&quot; from the debts.)
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="opportunity_rate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Opportunity cost recovery rate{' '}
                      <span className="text-muted-foreground">(%)</span>
                    </FormLabel>
                    <Input
                      type="number"
                      placeholder="5%"
                      value={field.value}
                      onChange={(e) => field.onChange(moneyRound(parseFloat(e.target.value) || 0))}
                    />
                    <FormDescription>
                      The rate to compound your savings for each month from the debt snowball.
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
                    <FormDescription>
                      The strategy you want to use to pay off your debt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" loading={form.formState.isSubmitting}>
                Calculate
              </Button>
            </CardContent>
          </Card>

          {shouldDisplayWealthAccelerator && (
            <Card>
              <CardHeader>
                <CardTitle>Wealth Accelerator Options</CardTitle>
                <CardDescription>Enter the lump sum cash to apply each year.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="p-4 border space-y-8">
                  <FormField
                    control={form.control}
                    name="pay_back_loan"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pay-back"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={!canPayBackLoan}
                          />
                          <FormLabel htmlFor="pay-back" className="text-md cursor-pointer">
                            Pay back loan
                          </FormLabel>
                        </div>

                        <FormDescription>
                          Displays the payments necessary to pay back the loan taken out to pay off
                          the debt.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="pay_interest"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2 ">
                          <Checkbox
                            id="pay-interest"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            onBlur={field.onBlur}
                            // disabled={!canPayBackLoan}
                            disabled
                          />
                          <FormLabel htmlFor="pay-interest" className="text-md cursor-pointer">
                            Only pay interest
                          </FormLabel>
                        </div>

                        <FormDescription>
                          Only pay off the interest accrued on the loan taken out.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="loan_interest_rate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Loan interest rate <span className="text-muted-foreground">(%)</span>
                        </FormLabel>
                        <Input
                          type="number"
                          placeholder="7%"
                          value={field.value}
                          disabled={!canPayBackLoan}
                          onChange={(e) =>
                            field.onChange(moneyRound(parseFloat(e.target.value) || 0))
                          }
                        />
                        <FormDescription>
                          The rate to compound the loan amounts taken, beginning when each lump sum
                          is taken out.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {Array.from({ length: form.getValues('lump_amounts')?.length }).map((_, i) => (
                    <FormField
                      key={`{lump}-${i}`}
                      control={form.control}
                      name={`lump_amounts.${i}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Year {i + 1}</FormLabel>
                          <div className="flex flex-row gap-3">
                            <CurrencyInput
                              placeholder="$20,000"
                              prefix="$"
                              value={form.getValues(`lump_amounts.${i}`)}
                              onValueChange={(value) => field.onChange(parseInt(value || '0'))}
                              onChange={undefined}
                            />
                            {i > 0 && (
                              <Button type="button" variant="outline" onClick={() => removeLump(i)}>
                                <X />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <Button type="button" variant="ghost" className="w-full" onClick={addLump}>
                  <Plus className="mr-1" />
                  Add Year
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </Form>
  );
}
