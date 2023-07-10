import { z } from 'zod';

import { Category } from '@/lib/plaid/types/transactions';

export const renameFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this institution.',
  }),
});

export const updateAccountFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this account.',
  }),
  type: z.enum(['personal', 'business'], {
    required_error: 'Please select a type for this account.',
  }),
  enabled: z.boolean({
    required_error: 'Please select whether this account is enabled or not.',
  }),
});

export type UpdateAccountType = z.infer<typeof updateAccountFormSchema>;

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
