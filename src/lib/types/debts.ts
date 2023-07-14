export type Debt = {
  id: number;
  user_id: string;
  description: string;
  amount: number;
  payment: number;
  interest_rate: number;
  months_remaining: number;
};
