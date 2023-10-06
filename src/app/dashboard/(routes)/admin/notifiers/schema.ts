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
  contactEmail: z.boolean(),
  creativeCashFlow: z.boolean(),
  debtSnowball: z.boolean(),
});

export type NotifierForm = z.infer<typeof notifierFormSchema>;
