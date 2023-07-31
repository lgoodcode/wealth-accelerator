import { z } from 'zod';

export const inputsFormSchema = z
  .object({
    start_date: z.date({
      required_error: 'Select a date.',
    }),
    end_date: z.date({
      required_error: 'Select a data.',
    }),
    all_other_income: z
      .number({
        required_error: 'Enter a number.',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      }),
    payroll_and_distributions: z
      .number({
        required_error: 'Enter a number.',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      }),
    lifestyle_expenses_tax_rate: z
      .number({
        required_error: 'Enter a percentage.',
      })
      .min(0, 'Enter a positive percentage')
      .max(101, 'Enter a valid percentage'),
    tax_account_rate: z
      .number({
        required_error: 'Enter a percentage.',
      })
      .min(0, 'Enter a positive percentage')
      .max(101, 'Enter a valid percentage'),
    optimal_savings_strategy: z
      .number({
        required_error: 'Enter a number.',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      }),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: 'Start date must be before end date.',
    path: ['start_date'],
  });

export type InputsFormSchemaType = z.infer<typeof inputsFormSchema>;
