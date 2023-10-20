import { Banknote, Filter, Landmark, Receipt } from 'lucide-react';

import type { Route } from './routes';

export const financeRoutes: Route[] = [
  {
    name: 'Finance Planning',
    path: '/dashboard/finance/finance-planning',
    Icon: Receipt,
    description: 'Manage personal finance information used in various features of the app.',
  },
  {
    name: 'Debts',
    path: '/dashboard/finance/debts',
    Icon: Banknote,
    description: 'Manage debt information such as credit cards, loans, and mortgages.',
  },
  {
    name: 'Banking',
    path: '/dashboard/finance/banking',
    Icon: Landmark,
    description: 'Add bank accounts and manage transactions received from Plaid.',
  },
  {
    name: 'Transaction Filtering',
    path: '/dashboard/finance/transaction-filtering',
    Icon: Filter,
    description: 'Filter transaction categories received from your bank accounts.',
  },
];
