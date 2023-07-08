import { Check, X, type LucideIcon } from 'lucide-react';

import type { AccountType } from '@/lib/plaid/types/institutions';

type TypeOption = {
  label: string;
  value: AccountType;
};

type EnabledOption = {
  icon: LucideIcon;
  value: 'true' | 'false';
};

export const typeOptions: TypeOption[] = [
  {
    label: 'Personal',
    value: 'personal',
  },
  {
    label: 'Business',
    value: 'business',
  },
];

export const enabledOptions: EnabledOption[] = [
  {
    icon: Check,
    value: 'true',
  },
  {
    icon: X,
    value: 'false',
  },
];
