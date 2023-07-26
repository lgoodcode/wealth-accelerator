import { z } from 'zod';

import { Role } from '@/lib/types';

export const registerUserFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Your name must contain at least 2 characters')
    .max(50, 'Name is too long'),
  email: z.string().nonempty('Please enter your email').email(),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(50, 'Password is too long')
    .refine((value) => /[a-z]+/.test(value), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((value) => /[A-Z]+/.test(value), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((value) => /[0-9]+/.test(value), {
      message: 'Password must contain at least one number',
    })
    .refine((value) => /[!@#$%&'*+/=?^_`{|}~-]+/.test(value), {
      message: 'Password must contain at least one special character',
    }),
});

export const updateUserFormSchema = registerUserFormSchema
  .omit({
    password: true,
  })
  .extend({
    role: z.nativeEnum(Role),
  });

export const sendResetPasswordEmailSchema = registerUserFormSchema.pick({
  email: true,
});

export const resetUserPasswordSchema = registerUserFormSchema.pick({
  password: true,
});

export type RegisterUserFormType = z.infer<typeof registerUserFormSchema>;

export type UpdateUserFormType = z.infer<typeof updateUserFormSchema>;

export type SendResetPasswordEmailFormType = z.infer<typeof sendResetPasswordEmailSchema>;

export type ResetUserPasswordFormType = z.infer<typeof resetUserPasswordSchema>;
