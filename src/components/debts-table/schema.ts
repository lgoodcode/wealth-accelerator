import { z } from 'zod';

export const debtFormSchema = z.object({
  description: z.string({
    required_error: 'Please enter a description for this debt',
  }),
  amount: z.coerce
    .number({
      required_error: 'Please enter an amount for this debt',
      invalid_type_error: 'Please enter an amount for this debt',
    })
    .positive({
      message: 'Enter a positive number',
    }),
  payment: z.coerce
    .number({
      required_error: 'Please enter a payment for this debt',
      invalid_type_error: 'Please enter a payment for this debt',
    })
    .min(0, 'Enter a number greater than or equal to 0'),
  interest: z.coerce
    .number({
      required_error: 'Please enter an interest rate for this debt',
      invalid_type_error: 'Please enter an interest rate for this debt',
    })
    .positive({
      message: 'Enter a positive interest rate',
    })
    .max(101, 'Enter a percentage less than or equal to 100')
    .refine((value) => /^\d{1,2}(\.\d{1,2})?$/.test(value.toString()), {
      message: 'Enter a valid percentage (0 to 99.99)',
    }),
  months_remaining: z.coerce
    .number({
      required_error: 'Please enter the months remaining for this debt',
      invalid_type_error: 'Please enter the months remaining for this debt',
    })
    .nonnegative({
      message: 'Enter a positive number',
    })
    .optional(),
});

export type DebtForm = z.infer<typeof debtFormSchema>;
