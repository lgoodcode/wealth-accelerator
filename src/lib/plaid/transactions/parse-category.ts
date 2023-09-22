import type { Transaction as PlaidTransaction } from 'plaid';
import { Category, type Filter, type Transaction } from '@/lib/plaid/types/transactions';

type ParsedCategory = {
  category: Category;
  filter_id: number | null;
  filter_type: 'user' | 'global' | null;
};

/**
 * Parses a Plaid, or our database transaction, and returns a category
 */
export const parseCategory = (
  transaction: PlaidTransaction | Transaction,
  user_filters: Filter[],
  global_filters: Filter[]
): ParsedCategory => {
  // Parse through the user filters first, which, if matches, would override the global filters
  // so we can return early and not have to parse through the global filters
  const user_filter = user_filters.find(({ filter }) => {
    const regex = new RegExp(filter, 'i');
    return regex.test(transaction.name);
  });

  if (user_filter) {
    return {
      filter_id: user_filter.id,
      filter_type: 'user',
      category: user_filter.category,
    };
  }

  // Parse through the global filters
  const global_filter = global_filters.find(({ filter }) => {
    const regex = new RegExp(filter, 'i');
    return regex.test(transaction.name);
  });

  if (global_filter) {
    return {
      filter_id: global_filter.id,
      filter_type: 'global',
      category: global_filter.category,
    };
  }

  // No matches, default to using the amount to determine the category
  if (transaction.amount > 0) {
    return {
      filter_id: null,
      filter_type: null,
      category: Category.MoneyOut,
    };
  }

  return {
    filter_id: null,
    filter_type: null,
    category: Category.MoneyIn,
  };
};
