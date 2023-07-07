import { Filter, Users } from 'lucide-react';

import type { Route } from './routes';

export const adminRoutes: Route[] = [
  {
    name: 'Transaction Filtering',
    path: '/dashboard/transaction-filtering',
    Icon: Filter,
    description: "Manage filtering transactions received from Plaid for user's bank accounts.",
  },
  {
    name: 'Manage Users',
    path: '/dashboard/manage-users',
    Icon: Users,
    description:
      'Manage users of the application. Create, update, and delete users. Manage user insurance policies.',
    disabled: true,
  },
];
