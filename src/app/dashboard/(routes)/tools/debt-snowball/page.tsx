import type { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Debt Snowball',
};

export default async function DebtSnowballPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Debt Snowball</h2>
        <p className="text-muted-foreground">
          View records saved from the Creative Cash Flow page.
        </p>
      </div>
      <Separator className="mt-6" />
    </div>
  );
}
