import { useAtomValue } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';

import { selectedInstitutionAtom } from '@/lib/plaid/atoms';
import { Category } from '@/lib/plaid/types/transactions';
import type { Account } from '@/lib/plaid/types/institutions';

type AccountOption = {
  label: string;
  value: string;
};

type CategoryOption = {
  label: string;
  value: Category;
};

export const useAccountOptions = (): AccountOption[] => {
  const queryClient = useQueryClient();
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const accounts = queryClient.getQueryData<Account[]>(['accounts', selectedInstitution?.item_id]);

  if (!accounts) {
    return [];
  }

  return accounts.map((account) => ({
    label: account.name,
    value: account.name,
  }));
};

export const categoryOptions: CategoryOption[] = [
  {
    label: 'Transfer',
    value: Category.Transfer,
  },
  {
    label: 'Money In',
    value: Category.MoneyIn,
  },
  {
    label: 'Money Out',
    value: Category.MoneyOut,
  },
];
