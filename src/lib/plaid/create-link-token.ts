import { plaidClient, createLinkTokenRequest } from './config';

export const createLinkToken = async (
  id: string,
  access_token?: string,
  account_update = false
) => {
  const response = await plaidClient.linkTokenCreate(
    createLinkTokenRequest(id, access_token, account_update)
  );
  return response.data.link_token;
};
