import { CheckSquare, Gauge, Newspaper, PackageOpen, Square } from 'lucide-react';

import type { Route } from './routes';

export const exampleRoutes: Route[] = [
  {
    name: 'Dashboard',
    path: '/dashboard/examples/dashboard',
    Icon: Gauge,
  },
  {
    name: 'Playground',
    path: '/dashboard/examples/playground',
    Icon: PackageOpen,
  },
  {
    name: 'Forms',
    path: '/dashboard/examples/forms',
    Icon: Newspaper,
  },
  {
    name: 'Tasks',
    path: '/dashboard/examples/tasks',
    Icon: CheckSquare,
  },
  {
    name: 'Cards',
    path: '/dashboard/examples/cards',
    Icon: Square,
  },
];
