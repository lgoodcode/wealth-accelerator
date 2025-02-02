import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z
    .string({
      required_error: 'Please enter your full name',
    })
    .min(2, 'Your name must contain at least 2 characters')
    .max(100, 'The maximum number of characters is 100'),
  email: z
    .string({
      required_error: 'Please enter your email',
    })
    .email({
      message: 'Please enter a valid email',
    }),
  message: z.string({
    required_error: 'Please enter your message',
  }),
});

export type ContactForm = z.infer<typeof contactSchema>;
