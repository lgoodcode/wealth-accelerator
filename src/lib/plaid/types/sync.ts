import type { PostgrestError } from '@supabase/postgrest-js';
import type { RemovedTransaction, Transaction } from 'plaid';

export const PlaidRateLimitErrorCode = 'TRANSACTIONS_SYNC_LIMIT';

type PlaidCredentialErrorCode = 'ITEM_LOGIN_REQUIRED' | 'PENDING_EXPIRATION';

export const PlaidCredentialErrorCodes: PlaidCredentialErrorCode[] = [
  'ITEM_LOGIN_REQUIRED',
  'PENDING_EXPIRATION',
];

export enum PlaidErrorType {
  InvalidRequest = 'INVALID_REQUEST',
}

export type ServerSyncTransactions = {
  error: {
    status: number;
    general: PostgrestError | Error | null;
    plaid: {
      isRateLimitError: boolean;
      isCredentialError: boolean;
      isOtherPlaidError: boolean;
    } | null;
  } | null;
  data: {
    hasMore: boolean;
    /** Used to pass to Sentry for debugging on errors */
    transactions: null | {
      added: Transaction[];
      modified: Transaction[];
      removed: RemovedTransaction[];
    };
  };
};

export type SyncTransactionsResponseError = {
  general: PostgrestError | Error | string | null;
  plaid: {
    isRateLimitError: boolean;
    isCredentialError: boolean;
    isOtherPlaidError: boolean;
  } | null;
};

export type SyncTransactionsResponseBody = {
  hasMore: boolean;
};

export type SyncTransactionsResponse =
  | {
      error: SyncTransactionsResponseError | null;
    }
  | SyncTransactionsResponseBody
  | null;
