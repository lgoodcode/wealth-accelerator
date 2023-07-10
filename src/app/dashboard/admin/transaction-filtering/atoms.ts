import { atom } from 'jotai';

import { Filter } from '@/lib/plaid/types/transactions';

export const isUpdateDialogOpenAtom = atom(false);

export const filtersAtom = atom<Filter[] | null>(null);

export const setFiltersAtom = atom(null, (get, set, updatedFilter: Filter) => {
  const filters = get(filtersAtom);
  let updated = false;

  if (!filters) {
    set(filtersAtom, [updatedFilter]);
    return;
  }

  const newFilters = filters.map((filter) => {
    if (filter.id === updatedFilter.id) {
      updated = true;
      return updatedFilter;
    }
    return filter;
  });

  if (!updated) {
    newFilters.push(updatedFilter);
  }

  set(filtersAtom, newFilters);
});

export const removeFilterAtom = atom(null, (get, set, id: number) => {
  const filters = get(filtersAtom);

  if (!filters) {
    throw new Error('Filters do not exist');
  }

  const index = filters.findIndex((filter) => filter.id === id);

  if (index !== -1) {
    // Filter exists, remove it
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    set(filtersAtom, newFilters);
  } else {
    throw new Error('Filter does not exist');
  }
});
