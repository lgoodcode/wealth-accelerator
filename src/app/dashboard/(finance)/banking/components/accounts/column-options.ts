import { Check, X, type LucideIcon } from 'lucide-react';

import type { AccountType } from '@/lib/plaid/types/institutions';

type TypeOption = {
  label: string;
  value: AccountType;
};

type EnabledOption = {
  label: string;
  value: 'true' | 'false';
  icon: LucideIcon;
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
    label: 'Enabled',
    value: 'true',
    icon: Check,
  },
  {
    label: 'Disabled',
    value: 'false',
    icon: X,
  },
];
