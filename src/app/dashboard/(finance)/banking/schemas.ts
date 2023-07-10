import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const renameFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this institution.',
  }),
});

export type RenameFormType = z.infer<typeof renameFormSchema>;

export const updateTransactionFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this transaction.',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this tranasction.',
  }),
});

export type UpdateTransactionType = z.infer<typeof updateTransactionFormSchema>;
