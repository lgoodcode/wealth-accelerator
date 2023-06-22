import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Personal Finance',
};

export type SidebarNavItem = {
  title: string;
  relativePath: `/${string}`;
};

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Strategy Start Date',
    relativePath: '/strategy-start-date',
  },
  {
    title: 'Index Fund Rates',
    relativePath: '/index-fund-rates',
  },
  {
    title: 'Wealth Accelerator',
    relativePath: '/wealth-accelerator',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="p-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Personal Finance</h2>
          <p className="text-muted-foreground">
            Manage settings used in calculalations for your finances.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-3 lg:w-1/5 xl:w-1/6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <Separator orientation="vertical" />
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
