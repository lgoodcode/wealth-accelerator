import type { Transaction as PlaidTransaction } from 'plaid';
import { Category, type Filter, type Transaction } from '@/lib/plaid/types/transactions';

/**
 * Parses a Plaid, or our database transaction, and returns a category
 */
export const parseCategory = (
  filters: Filter[],
  transaction: PlaidTransaction | Transaction
): Category => {
  const category = transaction.category?.[0] ?? 'uncategorized';

  // Check if the transaction matches a filter
  const filter = filters.find(({ filter }) => {
    const regex = new RegExp(filter, 'i');
    return regex.test(transaction.name);
  });

  if (filter) {
    return filter.category;
  } else if (category === Category.Transfer) {
    return Category.Transfer;
    // If the amount is positive, then money is moving out of the account
    // https://plaid.com/docs/api/products/transactions/#transactions-get-response-transactions-amount
  } else if (transaction.amount > 0) {
    return Category.MoneyOut;
  } else {
    return Category.MoneyIn;
  }
};
