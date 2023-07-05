import type { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import type { ClientInstitution } from './institutions';

export type CreateLinkTokenResponse = {
  link_token: string;
};

export type ExchangeLinkTokenBody = {
  public_token: string;
  metadata: PlaidLinkOnSuccessMetadata;
};

export type ExchangeLinkTokenResponse = {
  item: ClientInstitution;
};
