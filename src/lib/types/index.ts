export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_USER = 'SUPER_USER',
}

export type ManageUser = User & {
  confirmed_email: boolean;
};

/* Creative Cash Flow Notifier */
export type Notifier = {
  id: number;
  name: string;
  email: string;
  enabled: boolean;
};
