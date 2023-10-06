import { z } from 'zod';

export const notifierFormSchema = z.object({
  name: z.string({
    required_error: 'Enter a name',
  }),
  email: z
    .string({
      required_error: 'Enter an email',
    })
    .email({
      message: 'Enter a valid email',
    }),
  contact_email: z.boolean(),
  creative_cash_flow: z.boolean(),
  debt_snowball: z.boolean(),
});

export type NotifierForm = z.infer<typeof notifierFormSchema>;
