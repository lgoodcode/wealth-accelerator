import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const updateUserFilterFormSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter',
  }),
});

export type UpdateUserFilterForm = z.infer<typeof updateUserFilterFormSchema>;

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

export type CreateUserFilterForm = z.infer<typeof createUserFilterFormSchema>;

export const deleteUserFilterFormSchema = z.object({
  global_filter_id: z.coerce.number({
    required_error: 'Please select a filter to default to',
    invalid_type_error: 'Please select a filter to default to',
  }),
});

export type DeleteUserFilterForm = z.infer<typeof deleteUserFilterFormSchema>;
