import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const updateGlobalFilterFormSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter.',
  }),
});

export type UpdateGlobalFilterFormType = z.infer<typeof updateGlobalFilterFormSchema>;

export const createGlobalFilterFormSchema = z.object({
  filter: z.string({
    required_error: 'Enter the filter text',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Select a category',
  }),
});

export type CreateGlobalFilterFormType = z.infer<typeof createGlobalFilterFormSchema>;
