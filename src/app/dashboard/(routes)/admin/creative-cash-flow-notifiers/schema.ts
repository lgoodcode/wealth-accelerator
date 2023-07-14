import { z } from 'zod';

export const notifierFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for the notifier.',
  }),
  email: z
    .string({
      required_error: 'Please enter an email for the notifier.',
    })
    .email(),
  enabled: z.boolean({
    required_error: 'Please select whether this account is enabled or not.',
  }),
});

export type NotifierFormType = z.infer<typeof notifierFormSchema>;
