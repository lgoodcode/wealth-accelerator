'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { filtersAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';
import { FiltersTable } from './table/filters-table';

interface FiltersProps {
  filtersData: Filter[];
}

export function Filters({ filtersData }: FiltersProps) {
  const [filters, setFilters] = useAtom(filtersAtom);

  useEffect(() => {
    if (!filters) {
      setFilters(filtersData);
    }
  }, [filtersData]);

  return (
    <div className="flex justify-center">
      <FiltersTable filters={filtersData} />
    </div>
  );
}
