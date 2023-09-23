'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlaidFiltersTable } from './table/user-plaid-filters-table';
import { userFiltersAtom, globalFiltersAtom } from '../atoms';
import type { Filter, UserFilter } from '@/lib/plaid/types/transactions';

interface FiltersProps {
  userFiltersData: UserFilter[] | null;
  globalFilters: Filter[] | null;
}

export function UserPlaidFilters({ userFiltersData: filtersData, globalFilters }: FiltersProps) {
  const [filters, setFilters] = useAtom(userFiltersAtom);
  const setGlobalFilters = useSetAtom(globalFiltersAtom);

  useEffect(() => {
    setFilters(filtersData);
    setGlobalFilters(globalFilters);
  }, []);

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full mt-8">
        <CardContent>
          {!filters ? (
            <Loading className="mt-0 py-32" />
          ) : (
            <UserPlaidFiltersTable filters={filters} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
