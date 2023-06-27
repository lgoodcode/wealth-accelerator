import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { InstitutionSelection } from './components/institution-selection';

export const metadata: Metadata = {
  title: 'Banking',
};

interface BankingLayoutProps {
  children: React.ReactNode;
}

export default function BankingLayout({ children }: BankingLayoutProps) {
  return (
    <div className="p-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Banking</h2>
        <p className="text-muted-foreground">
          Manage institutions and view transactions for your bank accounts.
        </p>
      </div>
      <Separator className="mt-6" />
      <div className="flex flex-col space-y-8">
        <div className="flex w-full h-20 items-center border-b">
          <InstitutionSelection />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
