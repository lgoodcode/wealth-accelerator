'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue, useSetAtom } from 'jotai';
import { Plus, X } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
import { CurrencyInput } from '@/components/ui/currency-input';
import { PercentInput } from '@/components/ui/percent-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { labels } from '../labels';
import { debtCalculationInputsAtom, sortDebtsAtom } from '../atoms';
import { Strategies } from '../strategies';
import { useSnowballCalculate } from '../hooks/use-snowball-calculate';
import { debtCalculationSchema, type DebtCalculationSchemaType } from '../schema';
import type { Debt } from '@/lib/types/debts';

interface DebtSnowballInputsFormProps {
  debts: Debt[];
}

export function DebtSnowballInputsForm({ debts }: DebtSnowballInputsFormProps) {
  const inputs = useAtomValue(debtCalculationInputsAtom);
  const paymentsSum = debts.reduce((a, b) => a + b.payment, 0);
  const snowballCalculate = useSnowballCalculate();
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
    form.setValue(
      'monthly_payment',
      // Parse in case the value is a string from the CurrencyInput
      paymentsSum + parseFloat((additional_payment ?? '0').toString())
    );
  }, [additional_payment]);

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
      <form noValidate onSubmit={form.handleSubmit(snowballCalculate)}>
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-6 space-y-8">
              <FormField
                control={form.control}
                name="additional_payment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {labels.additionalPayment.title}{' '}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <CurrencyInput placeholder="$500" {...field} />
                    <FormDescription>{labels.additionalPayment.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthly_payment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{labels.monthlyPayment.title}</FormLabel>
                    <Input readOnly value={dollarFormatter(field.value)} />
                    <FormDescription>{labels.monthlyPayment.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="opportunity_rate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{labels.opportunityRate.title}</FormLabel>
                    <PercentInput placeholder="5%" {...field} />
                    <FormDescription>{labels.opportunityRate.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{labels.strategy.title}</FormLabel>
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
                    <FormDescription>{labels.strategy.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                loading={form.formState.isSubmitting}
                disabled={!debts.length}
              >
                Calculate
              </Button>
            </CardContent>
          </Card>

          {shouldDisplayWealthAccelerator && (
            <Card>
              <CardHeader>
                <CardTitle>{labels.wealthAcceleratorOptions.title}</CardTitle>
                <CardDescription>{labels.wealthAcceleratorOptions.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-8">
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
                        <FormDescription>{labels.payBackLoan.description}</FormDescription>
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
                        <FormLabel>{labels.loanInterestRate.title}</FormLabel>
                        <PercentInput placeholder="7%" disabled={!canPayBackLoan} {...field} />
                        <FormDescription>{labels.loanInterestRate.description}</FormDescription>
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
                              ref={field.ref}
                              placeholder="$20,000"
                              value={form.getValues(`lump_amounts.${i}`)}
                              onValueChange={field.onChange}
                              onBlur={field.onBlur}
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

                <Button type="button" variant="outline" className="w-full" onClick={addLump}>
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
