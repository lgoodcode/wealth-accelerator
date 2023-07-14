'use client';

import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUpdateRates } from '../use-update-rates';
import { RatesFormSchema, type RatesFormSchemaType } from '../schema';
import { useAtom } from 'jotai';
import { Input } from '@/components/ui/input';

const NUM_RATE_YEARS = 60;

// Override the type for the start_date because Supabase returns a string.
interface RatesFormProps {
  user: User;
  rates: number[] | null;
}

export function RatesForm({ user, rates }: RatesFormProps) {
  const updateRates = useUpdateRates();
  const [allRates, setAllRates] = useState<string>();
  const form = useForm<RatesFormSchemaType>({
    resolver: zodResolver(RatesFormSchema(NUM_RATE_YEARS)),
    values: { rates: rates ?? [] },
  });

  const onSubmit = async (data: RatesFormSchemaType) => {
    await updateRates(user.id, data)
      .then(() => {
        toast.success('Your information has been saved');
      })
      .catch((error) => {
        console.error(error);
        captureException(error);
        toast.error('Uh oh! Something went wrong. Please try again.');
      });
  };

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-row items-end">
          <FormItem className="flex flex-col w-full">
            <FormLabel>
              Set All Rates <span className="ml-1 text-muted-foreground">(%)</span>
            </FormLabel>
            <Input
              type="number"
              placeholder="Set All Rates"
              min={-100}
              max={100}
              value={allRates}
              onChange={(e) => setAllRates(e.target.value)}
            />
          </FormItem>
          <Button
            type="button"
            variant="outline"
            className="ml-2"
            onClick={() => {
              form.setValue('rates', Array(NUM_RATE_YEARS).fill(allRates));
            }}
          >
            <Copy size={20} />
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto space-y-8 p-6">
              {Array.from({ length: NUM_RATE_YEARS }, (_, i) => (
                <FormField
                  key={i}
                  control={form.control}
                  name={`rates.${i}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {`Year ${i + 1}`}
                        <span className="ml-1 text-muted-foreground">(%)</span>
                      </FormLabel>
                      <Input
                        type="number"
                        min={-100}
                        max={100}
                        placeholder={`Rate For Year ${i + 1}`}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" loading={form.formState.isSubmitting}>
          Save changes
        </Button>
      </form>
    </Form>
  );
}
