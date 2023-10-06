import { z } from 'zod';

export const notifierFormSchema = z.object({
  name: z.string({
    required_error: 'Enter a name',
  }),
  email: z
    .string({
      required_error: 'Enter an email',
    })
    .email(),
  enabled: z.boolean({
    required_error: 'Select whether this account is enabled or not',
  }),
});

export type NotifierForm = z.infer<typeof notifierFormSchema>;
