'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { accountsAtom } from '../atoms';
import { ManageAccounts } from './manage-accounts';
import { BalanceEntriesTable } from './table/waa-info-table';
import type { BalancesAccount } from '@/lib/types/balances';

interface BalancesProps {
  initial_accounts: BalancesAccount[];
}

export function Balances({ initial_accounts }: BalancesProps) {
  const [accounts, setAccounts] = useAtom(accountsAtom);

  useEffect(() => {
    setAccounts(initial_accounts);
  }, []);

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <div className="w-full">
        <ManageAccounts />

        <Card className="mt-8">
          <CardContent>
            {/* {!accounts ? <Loading className="mt-0 py-32" /> : <BalanceEntriesTable users={[]} />} */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
