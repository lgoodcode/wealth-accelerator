import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const updateGlobalFilterFormSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this filter',
  }),
});

export type UpdateGlobalFilterForm = z.infer<typeof updateGlobalFilterFormSchema>;

export const createGlobalFilterFormSchema = z.object({
  filter: z.string({
    required_error: 'Enter the filter text',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Select a category',
  }),
  override: z.boolean().optional(),
});

export type CreateGlobalFilterForm = z.infer<typeof createGlobalFilterFormSchema>;

export const deleteGlobalFilterFormSchema = z.object({
  global_filter_id: z.coerce.number({
    required_error: 'Please select a filter to default to',
    invalid_type_error: 'Please select a filter to default to',
  }),
});

export type DeleteGlobalFilterForm = z.infer<typeof deleteGlobalFilterFormSchema>;
