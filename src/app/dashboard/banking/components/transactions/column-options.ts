import type { Category } from '@/lib/plaid/types/transactions';

type CategoryOption = {
  label: string;
  value: Category;
};

type EnabledOption = {
  label: string;
  value: 'true' | 'false';
};

export const categoryOptions: CategoryOption[] = [
  {
    label: 'Transfer',
    value: 'Transfer',
  },
  {
    label: 'Money-In',
    value: 'Money-In',
  },
  {
    label: 'Money-Out',
    value: 'Money-Out',
  },
];

export const enabledOptions: EnabledOption[] = [
  {
    label: 'Enabled',
    value: 'true',
  },
  {
    label: 'Disabled',
    value: 'false',
  },
];
