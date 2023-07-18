import { Album, DollarSign } from 'lucide-react';

import type { Route } from './routes';

export const toolsRoutes: Route[] = [
  {
    name: 'Creative Cash Flow',
    path: '/dashboard/tools/creative-cash-flow/calculate',
    Icon: DollarSign,
    description: 'View where your money is going and how much you are saving.',
  },
  {
    name: 'Creative Cash Flow Records',
    path: '/dashboard/tools/creative-cash-flow/records',
    Icon: Album,
    description: 'View and manage records saved of your creative cash flow information.',
  },
];
