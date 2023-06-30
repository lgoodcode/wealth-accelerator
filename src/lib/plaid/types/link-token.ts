import type { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

export type CreateLinkTokenResponse = {
  link_token: string;
};

export type ExchangeLinkTokenBody = {
  public_token: string;
  metadata: PlaidLinkOnSuccessMetadata;
};

export type ExchangeLinkTokenResponse = {
  item_id: string;
};
