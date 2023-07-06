import type { LucideIcon } from 'lucide-react';

export type Route = {
  name: string;
  path: `/${string}`;
  Icon: LucideIcon;
  description?: string;
  disabled?: boolean;
};

const BASE_PATH = '/dashboard';

export const withBasePath = (path: `/${string}`) => {
  return BASE_PATH + path;
};
