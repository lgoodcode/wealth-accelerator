import { z } from 'zod';

export const financeInfoSchema = z.object({
  start_date: z.date({
    required_error: 'Select a date.',
  }),
  stop_invest: z.coerce
    .number({
      required_error: 'Enter the year',
      invalid_type_error: 'Enter a year',
    })
    .min(1, 'Enter a number greater than 0')
    .max(100, 'Enter a number less than or equal to 100'),
  start_withdrawl: z.coerce
    .number({
      required_error: 'Enter the year',
      invalid_type_error: 'Enter a year',
    })
    .min(1, 'Enter a number greater than 0')
    .max(100, 'Enter a number less than or equal to 100'),
  money_needed_to_live: z.coerce
    .number({
      required_error: 'Enter the amount',
      invalid_type_error: 'Enter the amount',
    })
    .min(1, 'Enter an amount greater than 0'),
  tax_bracket: z.coerce
    .number({
      required_error: 'Enter the tax bracket percentage',
      invalid_type_error: 'Enter the tax bracket percentage',
    })
    .min(0, 'Enter a positive percentage')
    .max(101, 'Enter a valid percentage'),
  tax_bracket_future: z.coerce
    .number({
      required_error: 'Enter the tax bracket percentage',
      invalid_type_error: 'Enter the tax bracket percentage',
    })
    .positive({
      message: 'Enter a positive percentage',
    })
    .max(101, 'Enter a valid percentage'),
  premium_deposit: z.coerce
    .number({
      required_error: 'Enter the amount',
      invalid_type_error: 'Enter  the amount',
    })
    .positive({
      message: 'Enter a positive amount',
    }),
  ytd_collections: z.coerce
    .number({
      required_error: 'Enter the amount',
      invalid_type_error: 'Enter  the amount',
    })
    .nonnegative({
      message: 'Enter a positive amount',
    }),
  default_tax_rate: z.coerce
    .number({
      required_error: 'Enter the tax rate percentage',
      invalid_type_error: 'Enter the tax rate percentage',
    })
    .positive({
      message: 'Enter a positive percentage',
    })
    .max(101, 'Enter a valid percentage'),
});

export const ratesFormSchema = (numOfYears: number) =>
  z.object({
    rates: z
      .array(
        z.coerce
          .number({
            required_error: 'Enter a rate',
            invalid_type_error: 'Enter a rate',
          })
          .refine((value) => /^-?\d{1,2}(\.\d{1,2})?$/.test(value.toString()), {
            message: 'Enter a valid percentage (-99.99 to 99.99)',
          })
      )
      .length(numOfYears, `Enter ${numOfYears} rates`),
  });

export const waaInfoSchema = z.object({
  date: z.date({
    required_error: 'Select a date.',
    invalid_type_error: 'Select a date.',
  }),
  amount: z.coerce
    .number({
      required_error: 'Enter the amount',
      invalid_type_error: 'Enter the amount',
    })
    .positive({
      message: 'Enter a positive amount',
    }),
});

export const accountSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for the account.',
  }),
});

export const balanceEntrySchema = waaInfoSchema;

export type FinanceInfoSchema = z.infer<typeof financeInfoSchema>;
export type RatesFormSchema = z.infer<ReturnType<typeof ratesFormSchema>>;
export type WaaInfoSchema = z.infer<typeof waaInfoSchema>;
export type AccountSchema = z.infer<typeof accountSchema>;
export type BalanceEntrySchema = z.infer<typeof balanceEntrySchema>;
