export const PlaidRateLimitErrorCode = 'TRANSACTIONS_SYNC_LIMIT';

export enum PlaidCredentialErrorCode {
  ItemLoginRequired = 'ITEM_LOGIN_REQUIRED',
  PendingExpiration = 'PENDING_EXPIRATION',
}

export enum PlaidErrorType {
  InvalidRequest = 'INVALID_REQUEST',
}

export type SyncResponse = {
  plaidError?: {
    isRateLimitError: boolean;
    isCredentialError: boolean;
    isOtherPlaidError: boolean;
  };
  hasMore: boolean;
};
