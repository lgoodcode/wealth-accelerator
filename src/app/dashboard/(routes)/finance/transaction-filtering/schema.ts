import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const updateUserFilterFormSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter',
  }),
});

export type UpdateUserFilterFormType = z.infer<typeof updateUserFilterFormSchema>;

export const createUserFilterFormSchema = z.object({
  filter: z.string({
    required_error: 'Enter the filter text',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Select a category',
  }),
  user_override: z.boolean().optional(),
  global_override: z.boolean().optional(),
});

export type CreateUserFilterFormType = z.infer<typeof createUserFilterFormSchema>;
