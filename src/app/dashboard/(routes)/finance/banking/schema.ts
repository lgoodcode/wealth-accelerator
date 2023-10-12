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
  type: z.enum(['personal', 'business', 'waa'], {
    required_error: 'Please select a type for this account.',
  }),
  enabled: z.boolean({
    required_error: 'Please select whether this account is enabled or not.',
  }),
});

export const updateTransactionFormSchema = z.object({
  name: z.string({
    required_error: 'Please enter a name for this transaction.',
  }),
  category: z.nativeEnum(Category, {
    required_error: 'Please select a category for this tranasction.',
  }),
});

export type RenameForm = z.infer<typeof renameFormSchema>;

export type UpdateAccountForm = z.infer<typeof updateAccountFormSchema>;

export type UpdateTransactionForm = z.infer<typeof updateTransactionFormSchema>;
