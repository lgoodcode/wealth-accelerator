export type Category = 'Transfer' | 'Money-In' | 'Money-Out';

export type Filter = {
  id: number;
  filter: string;
  category: Category;
};

export type Transaction = {
  id: string;
  item_id: string;
  account_id: string;
  name: string;
  amount: number;
  category: Category;
  date: string;
};
