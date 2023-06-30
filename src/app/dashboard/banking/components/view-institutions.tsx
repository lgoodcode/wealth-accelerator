import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { selectedInstitutionAtom } from '@/lib/atoms/institutions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AccountsTable } from './accounts/accounts-table';

enum TabsValue {
  Accounts = 'accounts',
  Transactions = 'transactions',
}

export function ViewInstitutions() {
  const selectedInstitution = useAtomValue(selectedInstitutionAtom);
  const [selectedTab, setSelectedTab] = useState<TabsValue>(TabsValue.Accounts);

  // Reset the selected tab when the selected institution changes
  // and fetch the institution data for the selected institution, if any
  useEffect(() => {
    if (selectedInstitution) {
      setSelectedTab(TabsValue.Accounts);
    }
  }, [selectedInstitution]);

  if (!selectedInstitution) {
    return null;
  }

  return (
    <div className="flex py-4 items-center justify-start lg:justify-end">
      <Tabs
        className="w-full"
        value={selectedTab}
        onValueChange={(selected) => {
          setSelectedTab(
            selected === TabsValue.Accounts ? TabsValue.Accounts : TabsValue.Transactions
          );
        }}
      >
        <TabsList className="grid w-[400px] grid-cols-2 ml-auto">
          <TabsTrigger value={TabsValue.Accounts}>Account</TabsTrigger>
          <TabsTrigger value={TabsValue.Transactions}>Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value={TabsValue.Accounts}>
          <AccountsTable item_id={selectedInstitution.item_id} />
        </TabsContent>
        <TabsContent value={TabsValue.Transactions}>
          <> {selectedInstitution?.name} transactions</>
        </TabsContent>
      </Tabs>
    </div>
  );
}
