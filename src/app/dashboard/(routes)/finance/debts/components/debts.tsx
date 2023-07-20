'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { debtsAtom } from '../atoms';
import { DebtsTable } from './table/debts-table';
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
