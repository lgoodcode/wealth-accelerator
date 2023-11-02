'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { fetcher } from '@/lib/utils/fetcher';
import { getWaaAccountId } from '../functions/get-waa-account-id';
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
import { inputLabels } from '../labels';
import { creativeCashFlowManagement } from '../functions/creative-cash-flow';
import { ccfInputsAtom, ccfResultsAtom } from '../atoms';
import { inputsFormSchema, type InputsFormSchema } from '../schema';
import type { Transaction } from '@/lib/plaid/types/transactions';

interface CcfInputsFormProps {
  user_id: string;
  transactions: {
    business: Transaction[];
    personal: Transaction[];
  };
  ytd_collections: number;
  default_tax_rate: number;
}

export function CreativeCashFlowInputs({
  transactions,
  ytd_collections,
  default_tax_rate,
}: CcfInputsFormProps) {
  const [creativeCashFlowInputs, setCreativeCashFlowInputs] = useAtom(ccfInputsAtom);
  const setCreativeCashFlowResults = useSetAtom(ccfResultsAtom);
  const form = useForm<InputsFormSchema>({
    resolver: zodResolver(inputsFormSchema),
    defaultValues: {
      ...creativeCashFlowInputs,
      tax_account_rate: creativeCashFlowInputs.tax_account_rate || default_tax_rate,
    },
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [noWaaAccount, setNoWaaAccount] = useState(false);
  const [waaAccount, setWaaAccount] = useState<{ item_id: string; account_id: string } | null>(
    null
  );

  const calculate = async (data: InputsFormSchema) => {
    if (isDisabled) {
      return;
    }

    if (!transactions.business.length && !transactions.personal.length) {
      toast.error(
        'There are no transactions to calculate the Creative Cash Flow. Please check your bank accounts.'
      );
      return;
    }

    let actual_waa: number | null = null;

    if (waaAccount && waaAccount.item_id && waaAccount.account_id) {
      // Retrieve the total WAA balance from Plaid
      const { error, data } = await fetcher<{ balance: number }>(
        `/api/plaid/institutions/balance/${waaAccount?.item_id}/${waaAccount?.account_id}`
      );

      if (error) {
        console.error(error);
        toast.warn('There was an error retrieving the WAA balance from Plaid.');
      } else {
        actual_waa = data?.balance ?? null;
      }
    } else {
      // Wait 1 second to simulate a loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setCreativeCashFlowInputs(structuredClone(data));

    const result = creativeCashFlowManagement({
      ...data,
      ytd_collections,
      business_transactions: transactions.business,
      personal_transactions: transactions.personal,
    });
    setCreativeCashFlowResults({
      ...result,
      actual_waa,
    });
  };

  useEffect(() => {
    (async () => {
      const waa_account = await getWaaAccountId();

      if (waa_account.error) {
        setIsDisabled(waa_account.error.code === 'MULTIPLE_WAA_ACCOUNTS');
        setNoWaaAccount(waa_account.error.code === 'NO_WAA_ACCOUNT');
        return;
      }

      setWaaAccount(waa_account.data);
    })();
  }, []);

  useEffect(() => {
    if (isDisabled) {
      toast.error(
        'There are multiple WAA accounts found. Please correct your accounts and only set one.',
        {
          // Keep the toast open so the user knows they must fix the issue
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    } else if (noWaaAccount) {
      toast.warn(
        'There is no WAA account found. Please set one to get a balance snapshot for the WAA tracking.'
      );
    }
  }, [isDisabled, noWaaAccount]);

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
              name="all_other_income"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{inputLabels.all_other_income.title}</FormLabel>
                  <CurrencyInput placeholder="$100,000" {...field} disabled={isDisabled} />
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
                  <CurrencyInput placeholder="$100,000" {...field} disabled={isDisabled} />
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
