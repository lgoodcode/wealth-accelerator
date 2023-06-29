import { useState } from 'react';
import { useAtomValue } from 'jotai';

import { selectedInstitutionAtom } from '@/lib/atoms/institutions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ViewInstitutions() {
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const [selectedTab, setSelectedTab] = useState<string | undefined>(
    selectedInstitution ? 'account' : undefined
  );

  return (
    <div className="flex py-4 items-center justify-start lg:justify-end">
      <Tabs className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-[400px] grid-cols-2 ml-auto">
          <TabsTrigger disabled={!selectedInstitution} value="account">
            Account
          </TabsTrigger>
          <TabsTrigger disabled={!selectedInstitution} value="transactions">
            Transactions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">{selectedInstitution?.name} accounts</TabsContent>
        <TabsContent value="transactions">{selectedInstitution?.name} transactions</TabsContent>
      </Tabs>
    </div>
  );
}
