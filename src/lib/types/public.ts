/**
 * Used in public pages to display a message returned from the server for users
 */
export type ServerMessage = {
  type: 'error' | 'success';
  message: string;
};
