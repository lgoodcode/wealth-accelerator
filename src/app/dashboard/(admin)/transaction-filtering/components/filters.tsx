'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { filtersAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';
import { FiltersTable } from './table/filters-table';

interface FiltersProps {
  filters: Filter[];
}

export function Filters({ filters }: FiltersProps) {
  const setFilters = useSetAtom(filtersAtom);

  useEffect(() => {
    setFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <FiltersTable />
    </div>
  );
}
