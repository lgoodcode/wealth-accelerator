import { Album, Banknote, DollarSign, Landmark, Receipt } from 'lucide-react';

import type { Route } from './routes';

export const financeRoutes: Route[] = [
  {
    name: 'Personal Finance',
    path: '/dashboard/personal-finance',
    Icon: Receipt,
    description: 'Manage personal finance information used in various features of the app.',
  },
  {
    name: 'Debt',
    path: '/dashboard/debt',
    Icon: Banknote,
    description: 'Mmanage debt information such as credit cards, loans, and mortgages.',
    disabled: true,
  },
  {
    name: 'Banking',
    path: '/dashboard/banking',
    Icon: Landmark,
    description: 'Add bank accounts and manage transactions received from Plaid.',
  },
  {
    name: 'Creative Cash Flow',
    path: '/dashboard/creative-cash-flow',
    Icon: DollarSign,
    description: 'View where your money is going and how much you are saving.',
  },
  {
    name: 'Creative Cash Flow Records',
    path: '/dashboard/creative-cash-flow-records',
    Icon: Album,
    description: 'View and manage records saved of your creative cash flow information.',
    disabled: true,
  },
];
