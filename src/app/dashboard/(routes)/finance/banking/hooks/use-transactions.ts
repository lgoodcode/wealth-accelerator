import { useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { captureException } from '@sentry/nextjs';

import { SUPABASE_QUERY_LIMIT } from '@/config/app';
import { supabase } from '@/lib/supabase/client';
import { updateModeAtom, linkTokenAtom } from '@/lib/plaid/atoms';
import { clientSyncTransactions } from '@/lib/plaid/transactions/clientSyncTransactions';
import { displaySyncError } from '@/lib/plaid/transactions/displaySyncError';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';
import type { TransactionWithAccountName } from '@/lib/plaid/types/transactions';

const CACHE_TRANASACTIONS_FOR = 1000 * 60 * 60; // Cache transactions for an hour

/**
 * Before making a request for tranasactions, we need to make sure that the item is synced
 * and doesn't have any credential errors.
 *
 * @returns `true` if the item needs to be updated, `false` otherwise.
 */
const syncTransactions = async (item: ClientInstitution) => {
  const syncError = await clientSyncTransactions(item.item_id);

  if (syncError) {
    displaySyncError(syncError, item.name);

    if (syncError.plaid?.isCredentialError) {
      return syncError.access_token;
    }
  }

  return null;
};

/**
 * When retrieving the transactions, we are keeping the Supabase default limit of 1000.
 * If we will have to make multiple requests using the offset and limit to get all the transactions.
 */
const getTransactions = async (item_id: string) => {
  const transactions: TransactionWithAccountName[] = [];
  let offset = 0;

  while (true) {
    const { error, data } = await supabase.rpc('get_transactions_with_account_name', {
      ins_item_id: item_id,
      offset_val: offset,
      limit_val: SUPABASE_QUERY_LIMIT,
    });

    if (error) {
      console.error(error);
      captureException(error);
      return [];
    }

    transactions.push(...(data as TransactionWithAccountName[]));

    // We know all the transactions are fetched when the data length received is less than the limit
    if (!data || data.length < SUPABASE_QUERY_LIMIT) {
      break;
    } else {
      offset += SUPABASE_QUERY_LIMIT;
    }
  }

  return (transactions ?? []) as TransactionWithAccountName[];
};

export const useTransactions = (item: ClientInstitution) => {
  const setUpdateMode = useSetAtom(updateModeAtom);
  const setLinkToken = useSetAtom(linkTokenAtom);

  const {
    isError,
    isFetching,
    data: transactions = [],
  } = useQuery<TransactionWithAccountName[]>(
    ['transactions', item.item_id],
    () => handleGetTransactions(),
    {
      staleTime: CACHE_TRANASACTIONS_FOR,
    }
  );

  /**
   * Handles the request for the transaction data, which makes a sync request intially
   * and if a credential error is returned, it will set the update mode to true and
   * return an empty array.
   *
   * @returns An array of transactions
   */
  const handleGetTransactions = useCallback(async () => {
    const accessTokenForUpdateMode = await syncTransactions(item);

    if (accessTokenForUpdateMode) {
      setUpdateMode(true);
      setLinkToken(accessTokenForUpdateMode);
      return [];
    }

    return await getTransactions(item.item_id);
  }, [item]);

  return {
    isError,
    isFetching,
    transactions,
  };
};
