import type { Transaction } from 'plaid';

import { parseCategory } from './parse-category';
import type {
  Filter,
  Transaction as ParsedTransaction,
  UserFilter,
} from '@/lib/plaid/types/transactions';

/**
 * Parses Plaid transactions and returns an array of transactions in the shape of our database
 */
export const parseTransactions = async (
  item_id: string,
  transactions: Transaction[],
  user_filters: UserFilter[],
  global_filters: Filter[]
): Promise<ParsedTransaction[]> => {
  return transactions.map((transaction) => {
    const { category, filter_id, filter_type } = parseCategory(
      transaction,
      user_filters,
      global_filters
    );

    return {
      id: transaction.transaction_id,
      item_id,
      account_id: transaction.account_id,
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      category,
      user_filter_id: filter_type === 'user' ? filter_id : null,
      global_filter_id: filter_type === 'global' ? filter_id : null,
    };
  });
};
