import { Check, X, type LucideIcon } from 'lucide-react';

type EnabledOption = {
  label: string;
  value: 'true' | 'false';
  icon: LucideIcon;
};

export const enabledOptions: EnabledOption[] = [
  {
    label: 'Enabled',
    icon: Check,
    value: 'true',
  },
  {
    label: 'Disabled',
    value: 'false',
    icon: X,
  },
];
