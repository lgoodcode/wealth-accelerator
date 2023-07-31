import { z } from 'zod';

export const FinanceInfoSchema = z.object({
  start_date: z.date({
    required_error: 'Select a date.',
  }),
  stop_invest: z
    .number({
      required_error: 'Enter the year',
    })
    .min(1, 'Enter a number greater than 0')
    .max(100, 'Enter a number less than or equal to 100'),
  start_withdrawl: z
    .number({
      required_error: 'Enter the year',
    })
    .min(1, 'Enter a number greater than 0')
    .max(100, 'Enter a number less than or equal to 100'),
  money_needed_to_live: z
    .number({
      required_error: 'Enter the amount',
    })
    .min(1, 'Enter an amount greater than 0'),
  tax_bracket: z
    .number({
      required_error: 'Enter the tax bracket percentage',
    })
    .min(0, 'Enter a positive percentage')
    .max(101, 'Enter a valid percentage'),
  tax_bracket_future: z
    .number({
      required_error: 'Enter the tax bracket percentage',
    })
    .positive({
      message: 'Enter a positive percentage',
    })
    .max(101, 'Enter a valid percentage'),
  premium_deposit: z
    .number({
      required_error: 'Enter the amount',
    })
    .positive({
      message: 'Enter a positive amount',
    }),
  ytd_collections: z
    .number({
      required_error: 'Enter the amount',
    })
    .nonnegative({
      message: 'Enter a positive amount',
    }),
  default_tax_rate: z
    .number({
      required_error: 'Enter the tax rate percentage',
    })
    .positive({
      message: 'Enter a positive percentage',
    })
    .max(101, 'Enter a valid percentage'),
});

export const RatesFormSchema = (numOfYears: number) =>
  z.object({
    rates: z
      .array(
        z
          .number({
            required_error: 'Enter a rate',
          })
          .refine((value) => /^-?\d{1,2}(\.\d{1,2})?$/.test(value.toString()), {
            message: 'Enter a valid percentage (-99.99 to 99.99)',
          })
      )
      .length(numOfYears, `Enter ${numOfYears} rates`),
  });

export type FinanceInfoSchemaType = z.infer<typeof FinanceInfoSchema>;
export type RatesFormSchemaType = z.infer<ReturnType<typeof RatesFormSchema>>;
