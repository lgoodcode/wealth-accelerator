export type Debt = {
  id: number;
  user_id: string;
  description: string;
  amount: number;
  payment: number;
  interest: number;
  months_remaining: number;
};
