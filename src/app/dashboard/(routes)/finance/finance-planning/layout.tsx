import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Finance Planning',
};

export type SidebarNavItem = {
  title: string;
  relativePath: `/${string}`;
};

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: 'Finance Info',
    relativePath: '/finance-info',
  },
  {
    title: 'Index Fund Rates',
    relativePath: '/index-fund-rates',
  },
  {
    title: 'WAA Information',
    relativePath: '/waa-info',
  },
  {
    title: 'Balances',
    relativePath: '/balances',
  },
];

interface PersonalFinanceLayoutProps {
  children: React.ReactNode;
}

export default function FinancePlanningLayout({ children }: PersonalFinanceLayoutProps) {
  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Finance Planning</h2>
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
  );
}
