import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
  type LinkTokenCreateRequest,
} from 'plaid';

export const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

// Configuration for the Plaid client
export const createLinkTokenRequest = (
  id: string,
  access_token?: string,
  account_update = false
): LinkTokenCreateRequest => {
  const base = {
    user: { client_user_id: id },
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    client_name: process.env.PLAID_CLIENT_NAME,
    language: 'en',
    access_token,
    country_codes: [CountryCode.Us],
    products: [Products.Transactions],
    redirect_uri: process.env.PLAID_REDIRECT_URI,
    webhook: process.env.PLAID_WEBHOOK_URI,
  };

  // https://plaid.com/docs/link/update-mode/#using-update-mode-to-request-new-accounts
  if (account_update) {
    return {
      ...base,
      update: { account_selection_enabled: true },
    };
  }

  return base;
};

// Takes a user's access token and returns a new LinkTokenCreateRequest to trigger update mode
export const createUpdateModeLinkTokenRequest = (
  id: string,
  access_token: string
): LinkTokenCreateRequest => ({
  ...createLinkTokenRequest(id),
  access_token,
});
