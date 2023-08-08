import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const updateFilterFormSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter.',
  }),
});

export type UpdateFilterFormType = z.infer<typeof updateFilterFormSchema>;

export const createFilterFormSchema = z.object({
  filter: z.string({
    required_error: 'Enter the filter text',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Select a category',
  }),
});

export type CreateFilterFormType = z.infer<typeof createFilterFormSchema>;
