'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { selectedInstitutionAtom } from '@/lib/plaid/atoms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AccountsTable } from './accounts/table/accounts-table';
import { TransactionsTable } from './transactions/table/transactions-table';

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
    <div className="flex py-4 items-center">
      <Tabs
        className="w-full"
        value={selectedTab}
        onValueChange={(selected) => {
          setSelectedTab(
            selected === TabsValue.Accounts ? TabsValue.Accounts : TabsValue.Transactions
          );
        }}
      >
        <TabsList className="grid w-[400px] grid-cols-2 ml-0 lg:ml-auto">
          <TabsTrigger value={TabsValue.Accounts}>Account</TabsTrigger>
          <TabsTrigger value={TabsValue.Transactions}>Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value={TabsValue.Accounts}>
          <div className="flex justify-center mx-auto lg:w-[1024px]">
            <Card className="w-auto mt-8">
              <CardContent>
                <AccountsTable item_id={selectedInstitution.item_id} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value={TabsValue.Transactions}>
          <div className="flex justify-center mx-auto lg:w-[1280px]">
            <Card className="w-full mt-8">
              <CardContent>
                <TransactionsTable item={selectedInstitution} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
