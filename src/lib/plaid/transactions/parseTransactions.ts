import type { Transaction } from 'plaid';

import { parseCategory } from './parseCategory';
import type { Filter } from '@/lib/plaid/types/transactions';

/**
 * Parses Plaid transactions and returns an array of transactions in the shape of our database
 */
export const parseTransactions = async (
  item_id: string,
  transactions: Transaction[],
  filters: Filter[]
) => {
  return transactions.map((transaction) => ({
    id: transaction.transaction_id,
    item_id,
    account_id: transaction.account_id,
    name: transaction.name,
    amount: transaction.amount,
    category: parseCategory(filters, transaction),
    date: transaction.date,
  }));
};
