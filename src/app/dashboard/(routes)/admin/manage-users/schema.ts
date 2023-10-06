import { z } from 'zod';

export const inviteUserSchema = z.object({
  name: z
    .string({
      required_error: 'Enter the name of the user',
    })
    .min(2, 'The name must contain at least 2 characters')
    .max(50, 'The name is too long'),
  email: z
    .string({
      required_error: 'Enter the email',
    })
    .email(),
});

export type InviteUserForm = z.infer<typeof inviteUserSchema>;
