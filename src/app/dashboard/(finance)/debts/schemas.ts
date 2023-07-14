import { z } from 'zod';

export const debtFormSchema = z.object({
  description: z.string({
    required_error: 'Please enter a description for this debt.',
  }),
  amount: z.number({
    required_error: 'Please enter an amount for this debt.',
  }),
  payment: z.number({
    required_error: 'Please enter a payment for this debt.',
  }),
  interest: z
    .number({
      required_error: 'Please enter an interest for this debt.',
    })
    .refine((value) => /^-?\d{1,2}(\.\d{1,2})?$/.test(value.toString()), {
      message: 'Enter a valid percentage (-99.99 to 99.99)',
    }),
  months_remaining: z
    .number({
      required_error: 'Please enter the months remaining for this debt.',
    })
    .min(0, 'Enter a number greater than or equal to 0'),
});

export type DebtFormType = z.infer<typeof debtFormSchema>;
