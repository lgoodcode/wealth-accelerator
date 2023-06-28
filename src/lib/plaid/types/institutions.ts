export type Institution = {
  item_id: string;
  user_id: string;
  name: string;
  access_token: string;
  cursor: string | null;
  expiration: string;
};

/**
 * On the client, don't retrieve the access_token, which is sensitive, to pass back
 * to the server
 */
export type ClientInstitution = Omit<Institution, 'access_token' | 'user_id'>;
