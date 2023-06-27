import { BookOpen, LineChart, Shield } from 'lucide-react';

import type { Route } from './routes';

export const generalRoutes: Route[] = [
  {
    name: 'Statistics',
    path: '/statistics',
    Icon: LineChart,
    description: 'View statistics of your finances and the Wealth Accelerator.',
  },

  {
    name: 'Insurance Policy',
    path: '/insurance-policy',
    Icon: Shield,
    description: 'View insurance policies.',
  },

  {
    name: 'Glossary',
    path: '/glossary',
    Icon: BookOpen,
    description: 'View vocabulary and their definitions used in the app.',
  },
];
