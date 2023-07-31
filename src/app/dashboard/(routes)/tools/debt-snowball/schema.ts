import { z } from 'zod';
import { Strategies } from './strategies';
import { differenceInMonths, isAfter } from 'date-fns';

export const debtCalculationSchema = z.object({
  target_date: z
    .date({
      required_error: 'Select a date.',
    })
    // Date cannot be in the past
    .refine((val) => isAfter(val, new Date()), 'Date cannot be in the past')
    // Date must be at least one month in the future
    .refine(
      (val) => differenceInMonths(val, new Date()),
      'Date must be at least one month in the future'
    )
    .optional(),
  additional_payment: z
    .number({
      required_error: 'Enter the amount you can pay each month',
    })
    .min(0, 'Enter a positive amount'),
  monthly_payment: z.number(),
  strategy: z.nativeEnum(Strategies, {
    required_error: 'Select a strategy',
  }),
});

// export const wealthAcceleratorDebtCalculationSchema =

export type DebtCalculationSchemaType = z.infer<typeof debtCalculationSchema>;
