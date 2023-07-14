import { Banknote, Landmark, Receipt, BookOpen, LineChart, Shield } from 'lucide-react';

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
  // {
  //   name: 'Statistics',
  //   path: '/statistics',
  //   Icon: LineChart,
  //   description: 'View statistics of your finances and the Wealth Accelerator.',
  //   disabled: true,
  // },
  // {
  //   name: 'Insurance Policies',
  //   path: '/insurance-policies',
  //   Icon: Shield,
  //   description: 'View insurance policies.',
  //   disabled: true,
  // },
  // {
  //   name: 'Glossary',
  //   path: '/glossary',
  //   Icon: BookOpen,
  //   description: 'View vocabulary and their definitions used in the app.',
  //   disabled: true,
  // },
];
