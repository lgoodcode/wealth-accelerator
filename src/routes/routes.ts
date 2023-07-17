import type { LucideIcon } from 'lucide-react';

export type Route = {
  name: string;
  path: `/${string}`;
  Icon: LucideIcon;
  description?: string;
  disabled?: boolean;
};
