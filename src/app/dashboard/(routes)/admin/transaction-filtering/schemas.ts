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
    required_error: 'Please enter a filter for this filter.',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter.',
  }),
});

export type CreateFilterFormType = z.infer<typeof createFilterFormSchema>;
