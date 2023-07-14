'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { debtsAtom } from '../atoms';
import { DebtsTable } from './table/debts-table';
import type { Debt } from '@/lib/types/debts';

interface DebtsProps {
  debtsData: Debt[];
}

export function Debts({ debtsData }: DebtsProps) {
  const [debts, setDebts] = useAtom(debtsAtom);

  useEffect(() => {
    setDebts(debtsData);
  }, []);

  return (
    <div className="flex justify-center">
      <DebtsTable debts={debts} />
    </div>
  );
}
