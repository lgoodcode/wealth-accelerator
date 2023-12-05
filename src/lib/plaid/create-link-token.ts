import { plaidClient, createLinkTokenRequest } from './config';

export const createLinkToken = async (id: string, access_token?: string) => {
  const response = await plaidClient.linkTokenCreate(createLinkTokenRequest(id, access_token));
  return response.data.link_token;
};
