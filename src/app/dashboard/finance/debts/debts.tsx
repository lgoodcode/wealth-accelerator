'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { Loading } from '@/components/loading';
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

  if (!debts) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center mt-8 mx-auto lg:w-[1024px]">
      <DebtsTable debts={debts} />
    </div>
  );
}
