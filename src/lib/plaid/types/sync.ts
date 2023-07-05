import type { PostgrestError } from '@supabase/postgrest-js';

export const PlaidRateLimitErrorCode = 'TRANSACTIONS_SYNC_LIMIT';

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
    plaid: {
      isRateLimitError: boolean;
      isCredentialError: boolean;
      isOtherPlaidError: boolean;
    } | null;
  } | null;
  data: {
    hasMore: boolean;
  };
};

export type SyncTransactionsResponseError = {
  general: PostgrestError | Error | null;
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
