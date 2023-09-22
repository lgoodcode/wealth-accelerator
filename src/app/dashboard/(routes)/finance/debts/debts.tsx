'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { DebtsTable } from '@/components/debts-table';
import { debtsAtom } from '@/components/debts-table/atoms';
import type { Debt } from '@/lib/types/debts';

interface DebtsProps {
  debtsData: Debt[] | null;
}

export function Debts({ debtsData }: DebtsProps) {
  const [debts, setDebts] = useAtom(debtsAtom);

  useEffect(() => {
    setDebts(debtsData);
  }, []);

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full mt-8">
        <CardContent>
          {!debts ? <Loading className="mt-0 py-32" /> : <DebtsTable debts={debts} />}
        </CardContent>
      </Card>
    </div>
  );
}
