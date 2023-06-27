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
    title: 'Wealth Accelerator Info',
    relativePath: '/wealth-accelerator-info',
  },
  {
    title: 'Index Fund Rates',
    relativePath: '/index-fund-rates',
  },
];

interface PersonalFinanceLayoutProps {
  children: React.ReactNode;
}

export default function PersonalFinanceLayout({ children }: PersonalFinanceLayoutProps) {
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
          <aside className="-mx-3 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <Separator orientation="vertical" className="h-auto hidden lg:flex" />
          <Separator className="flex lg:hidden" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
