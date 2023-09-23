import { atom } from 'jotai';

import type { UserFilter } from '@/lib/plaid/types/transactions';

export const userFiltersAtom = atom<UserFilter[] | null>(null);

export const hasUserFilterAtom = atom(null, (get, _set, filter: string) => {
  const filters = get(userFiltersAtom);

  if (!filters) {
    return false;
  }

  return filters.some((f) => f.filter === filter);
});

export const addUserFilterAtom = atom(null, (_get, set, newFilter: UserFilter) => {
  set(userFiltersAtom, (filters) => {
    if (!filters) {
      return [newFilter];
    }

    return [...filters, newFilter];
  });
});

export const updateUserFilterAtom = atom(null, (_get, set, updatedFilter: UserFilter) => {
  set(userFiltersAtom, (filters) => {
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

export const removeUserFilterAtom = atom(null, (_get, set, id: number) => {
  set(userFiltersAtom, (filters) => {
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
