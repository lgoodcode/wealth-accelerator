// export type Category = 'Transfer' | 'Money-In' | 'Money-Out';
export enum Category {
  Transfer = 'Transfer',
  MoneyIn = 'Money-In',
  MoneyOut = 'Money-Out',
}

export type Filter = {
  id: number;
  filter: string;
  category: Category;
};

export type UserFilter = Filter & {
  user_id: string;
  user_override: boolean;
  global_override: boolean;
};

export type Transaction = {
  id: string;
  item_id: string;
  account_id: string;
  name: string;
  amount: number;
  category: Category;
  date: string;
  user_filter_id: number | null;
  global_filter_id: number | null;
};

export type TransactionWithAccountName = Transaction & {
  account: string;
};
