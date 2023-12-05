export type Institution = {
  item_id: string;
  user_id: string;
  name: string;
  access_token: string;
  cursor: string | null;
  expiration: string;
  new_accounts: boolean;
};

/**
 * On the client, don't retrieve the access_token, which is sensitive, to pass back
 * to the server
 */
export type ClientInstitution = Omit<Institution, 'access_token' | 'user_id'>;

export type AccountType = 'business' | 'personal' | 'waa';

export type Account = {
  account_id: string;
  item_id: string;
  name: string;
  type: AccountType;
  enabled: boolean;
};
