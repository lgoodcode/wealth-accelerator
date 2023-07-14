import { atom } from 'jotai';

import { Filter } from '@/lib/plaid/types/transactions';

export const isUpdateDialogOpenAtom = atom(false);

export const filtersAtom = atom<Filter[] | null>(null);

export const hasFilterAtom = atom(null, (get, _set, filter: string) => {
  const filters = get(filtersAtom);

  if (!filters) {
    return false;
  }

  return filters.some((f) => f.filter === filter);
});

export const addFilterAtom = atom(null, (_get, set, newFilter: Filter) => {
  set(filtersAtom, (filters) => {
    if (!filters) {
      return [newFilter];
    }

    return [...filters, newFilter];
  });
});

export const updateFilterAtom = atom(null, (_get, set, updatedFilter: Filter) => {
  set(filtersAtom, (filters) => {
    if (!filters) {
      throw new Error('filtersAtom is not initialized');
    }

    const index = filters.findIndex((filter) => filter.id === updatedFilter.id);

    if (index === -1) {
      throw new Error('Filter does not exist');
    }

    const newFilters = [...filters];
    newFilters[index] = updatedFilter;

    return newFilters;
  });
});

export const removeFilterAtom = atom(null, (_get, set, id: number) => {
  set(filtersAtom, (filters) => {
    if (!filters) {
      throw new Error('filtersAtom is not initialized');
    }

    const index = filters.findIndex((filter) => filter.id === id);

    if (index === -1) {
      throw new Error('Filter does not exist');
    }

    const newFilters = [...filters];
    newFilters.splice(index, 1);

    return newFilters;
  });
});
