import { Category } from '@/lib/plaid/types/transactions';

type CategoryOption = {
  label: string;
  value: Category;
};

export const categoryOptions: CategoryOption[] = [
  {
    label: 'Transfer',
    value: Category.Transfer,
  },
  {
    label: 'Money-In',
    value: Category.MoneyIn,
  },
  {
    label: 'Money-Out',
    value: Category.MoneyOut,
  },
];
