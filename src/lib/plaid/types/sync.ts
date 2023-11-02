import type { PostgrestError } from '@supabase/postgrest-js';

export const PlaidRateLimitErrorCode = 'TRANSACTIONS_SYNC_LIMIT';

export const PlaidTransactionsSyncMutationErrorCode =
  'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION';

export enum PlaidCredentialErrorCode {
  ItemLoginRequired = 'ITEM_LOGIN_REQUIRED',
  PendingExpiration = 'PENDING_EXPIRATION',
}

export enum PlaidErrorType {
  InvalidRequest = 'INVALID_REQUEST',
}

export type ServerSyncTransactions = {
  error: {
    status: number;
    general: PostgrestError | Error | null;
    link_token: string | null;
    plaid: {
      isRateLimitError: boolean;
      isCredentialError: boolean;
      isSyncMutationError: boolean;
      isOtherPlaidError: boolean;
    } | null;
  } | null;
  data: {
    hasMore: boolean;
    /** The number of transactions for each category - used to pass to Sentry for debugging on errors */
    transactions: null | {
      added: number;
      modified: number;
      removed: number;
    };
  };
};

export type SyncTransactionsResponseError = {
  general: PostgrestError | Error | string | null;
  link_token: string | null;
  plaid: {
    isRateLimitError: boolean;
    isCredentialError: boolean;
    isOtherPlaidError: boolean;
  } | null;
};

export type SyncTransactionsResponse = {
  error: SyncTransactionsResponseError | null;
  hasMore: boolean;
};
