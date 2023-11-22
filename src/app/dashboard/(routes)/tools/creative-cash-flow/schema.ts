import { z } from 'zod';

export const inputsFormSchema = z
  .object({
    start_date: z.date({
      required_error: 'Select a date',
      invalid_type_error: 'Select a date',
    }),
    end_date: z.date({
      required_error: 'Select a date',
      invalid_type_error: 'Select a date',
    }),
    all_other_income: z.coerce
      .number({
        required_error: 'Enter an amount',
        invalid_type_error: 'Enter an amount',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      }),
    payroll_and_distributions: z.coerce
      .number({
        required_error: 'Enter an amount',
        invalid_type_error: 'Enter an amount',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      }),
    lifestyle_expenses_tax_rate: z.coerce
      .number({
        required_error: 'Enter a percentage',
        invalid_type_error: 'Enter a percentage',
      })
      .min(0, 'Enter a positive percentage')
      .max(101, 'Enter a valid percentage'),
    tax_account_rate: z.coerce
      .number({
        required_error: 'Enter a percentage',
        invalid_type_error: 'Enter a percentage',
      })
      .positive({
        message: 'Enter a positive percentage',
      })
      .max(101, 'Enter a valid percentage'),
    optimal_savings_strategy: z.coerce
      .number({
        required_error: 'Enter an amount',
        invalid_type_error: 'Enter an amount',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      }),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: 'Start date must be before end date',
    path: ['start_date'],
  });

export const visualizerInputFormSchema = z
  .object({
    interval: z.enum(['weekly', 'monthly']),
    start_date: z.date({
      required_error: 'Select a date',
      invalid_type_error: 'Select a date',
    }),
    end_date: z.date({
      required_error: 'Select a date',
      invalid_type_error: 'Select a date',
    }),
    lifestyle_expenses_tax_rate: z.coerce
      .number({
        required_error: 'Enter a percentage',
        invalid_type_error: 'Enter a percentage',
      })
      .min(0, 'Enter a positive percentage')
      .max(101, 'Enter a valid percentage'),
    tax_account_rate: z.coerce
      .number({
        required_error: 'Enter a percentage',
        invalid_type_error: 'Enter a percentage',
      })
      .positive({
        message: 'Enter a positive percentage',
      })
      .max(101, 'Enter a valid percentage'),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: 'Start date must be before end date',
    path: ['start_date'],
  });

export type InputsFormSchema = z.infer<typeof inputsFormSchema>;

export type VisualizerInputFormSchema = z.infer<typeof visualizerInputFormSchema>;
