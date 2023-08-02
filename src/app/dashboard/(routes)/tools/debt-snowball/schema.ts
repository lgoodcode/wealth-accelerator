import { z } from 'zod';
import { Strategies } from './strategies';

export const debtCalculationSchema = z.object({
  additional_payment: z
    .number({
      required_error: 'Enter the amount you can pay each month',
    })
    .nonnegative({
      message: 'Enter a positive amount',
    })
    .optional(),
  monthly_payment: z.number(),
  strategy: z.nativeEnum(Strategies, {
    required_error: 'Select a strategy',
  }),
  opportunity_rate: z
    .number({
      required_error: 'Enter a rate',
    })
    .nonnegative({
      message: 'Enter a positive rate',
    })
    .max(100, {
      message: 'Enter a rate less than 100%',
    }),
  lump_amounts: z.array(
    z
      .number({
        required_error: 'Enter a lump amount',
      })
      .nonnegative({
        message: 'Enter a positive amount',
      })
  ),
});

export type DebtCalculationSchemaType = z.infer<typeof debtCalculationSchema>;
