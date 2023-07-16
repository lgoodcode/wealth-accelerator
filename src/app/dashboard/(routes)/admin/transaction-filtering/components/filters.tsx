'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { FiltersTable } from './table/filters-table';
import { filtersAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';

interface FiltersProps {
  filtersData: Filter[] | null;
}

export function Filters({ filtersData }: FiltersProps) {
  const [filters, setFilters] = useAtom(filtersAtom);

  useEffect(() => {
    setFilters(filtersData);
  }, []);

  if (!filters) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center">
      <FiltersTable filters={filters} />
    </div>
  );
}
