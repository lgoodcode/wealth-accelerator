export type ManageUser = User & {
  confirmed_email: boolean;
};

export type Notifier = {
  id: number;
  name: string;
  email: string;
  contact_email: boolean;
  creative_cash_flow: boolean;
  debt_snowball: boolean;
};
