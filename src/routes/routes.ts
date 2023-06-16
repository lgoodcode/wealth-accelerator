import type { LucideIcon } from 'lucide-react';

export type Route = {
  name: string;
  path: string;
  Icon: LucideIcon;
  description?: string;
};

const BASE_PATH = '/dashboard';

export const withBasePath = (path: `/${string}`) => {
  return BASE_PATH + path;
};
