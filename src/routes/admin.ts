import { Bell, Filter, Users } from 'lucide-react';

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
  {
    name: 'Creative Cash Flow Notifications',
    path: '/dashboard/creative-cash-flow-notifications',
    Icon: Bell,
    description:
      'Manage the emails that will be notified when a user shares a Creative Cash Flow Record.',
  },
];
