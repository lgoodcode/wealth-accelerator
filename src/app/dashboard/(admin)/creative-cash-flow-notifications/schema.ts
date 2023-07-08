import { z } from 'zod';

export const updateNotifierFormSchema = z.object({
  email: z
    .string({
      required_error: 'Please enter an email for the notifier.',
    })
    .email(),
  enabled: z.boolean({
    required_error: 'Please select whether this account is enabled or not.',
  }),
});

export type UpdateNotifiersType = z.infer<typeof updateNotifierFormSchema>;
