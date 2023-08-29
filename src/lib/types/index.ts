export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type ManageUser = User & {
  confirmed_email: boolean;
};
