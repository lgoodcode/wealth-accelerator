import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for the account.',
  }),
});

export type AccountSchema = z.infer<typeof accountSchema>;
