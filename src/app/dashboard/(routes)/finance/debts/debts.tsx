'use client';

import { Loading } from '@/components/loading';
import { DebtsTable } from '@/components/debts-table';
import type { Debt } from '@/lib/types/debts';

interface DebtsProps {
  debts: Debt[] | null;
}

export function Debts({ debts }: DebtsProps) {
  if (!debts) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center mt-8 mx-auto lg:w-[1024px]">
      <DebtsTable debts={debts} />
    </div>
  );
}
