import { atom } from 'jotai';

import { Filter } from '@/lib/plaid/types/transactions';

export const isUpdateDialogOpenAtom = atom(false);

export const filtersAtom = atom<Filter[]>([]);

export const setFiltersAtom = atom(null, (get, set, updatedFilter: Filter) => {
  const filters = get(filtersAtom);
  const index = filters.findIndex((filter) => filter.id === updatedFilter.id);

  if (index !== -1) {
    // Filter exists, update it
    const newFilters = [...filters];
    newFilters[index] = updatedFilter;
    set(filtersAtom, newFilters);
  } else {
    // Filter does not exist, add it to the array
    set(filtersAtom, [...filters, updatedFilter]);
  }
});

export const removeFilterAtom = atom(null, (get, set, id: number) => {
  const filters = get(filtersAtom);
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
