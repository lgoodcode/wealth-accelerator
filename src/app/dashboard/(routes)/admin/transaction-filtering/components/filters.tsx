'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { FiltersTable } from './table/filters-table';
import { globalFiltersAtom } from '../atoms';
import type { Filter } from '@/lib/plaid/types/transactions';

interface FiltersProps {
  filtersData: Filter[] | null;
}

export function Filters({ filtersData }: FiltersProps) {
  const [filters, setFilters] = useAtom(globalFiltersAtom);

  useEffect(() => {
    setFilters(filtersData);
  }, []);

  if (!filters) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full mt-8">
        <CardContent>
          <FiltersTable filters={filters} />
        </CardContent>
      </Card>
    </div>
  );
}
