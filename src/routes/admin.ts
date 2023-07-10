import { Bell, Filter, Users } from 'lucide-react';

import type { Route } from './routes';

export const adminRoutes: Route[] = [
  {
    name: 'Transaction Filtering',
    path: '/dashboard/admin/transaction-filtering',
    Icon: Filter,
    description: "Manage filtering transactions received from Plaid for user's bank accounts.",
  },
  {
    name: 'Manage Users',
    path: '/dashboard/admin/manage-users',
    Icon: Users,
    description:
      'Manage users of the application. Create, update, and delete users. Manage user insurance policies.',
  },
  {
    name: 'Creative Cash Flow Notifiers',
    path: '/dashboard/admin/creative-cash-flow-notifiers',
    Icon: Bell,
    description:
      'Manage the people that will be notified when a user shares a Creative Cash Flow Record.',
  },
];
