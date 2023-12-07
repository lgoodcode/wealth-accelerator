import { atom } from 'jotai';

import type { BalancesAccount } from '@/lib/types/balances';

export const accountsAtom = atom<BalancesAccount[] | null>(null);
export const selectedAccountAtom = atom<BalancesAccount | null>(null);

// Adds a newly connected institution to the institutions array
export const addAccountAtom = atom(null, (get, set, newAccount: BalancesAccount) => {
  const accs = get(accountsAtom);

  if (!accs) {
    throw new Error('accountsAtom is not initialized');
  }

  set(accountsAtom, [...accs, newAccount]);

  // Update the selectedAccountAtom
  set(selectedAccountAtom, newAccount);
});

export const updateAccountAtom = atom(null, (get, set, updatedAccount: BalancesAccount) => {
  const accs = get(accountsAtom);

  if (!accs) {
    throw new Error('accountsAtom is not initialized');
  }

  const index = accs.findIndex((acc) => acc.id === updatedAccount.id);
  if (index >= 0) {
    // Item exists, update it
    const newArray = [...accs];
    newArray[index] = updatedAccount;
    set(accountsAtom, newArray);
  } else {
    // Item does not exist, add it to the array
    set(accountsAtom, [...accs, updatedAccount]);
  }

  // Update the selectedAccountAtom
  set(selectedAccountAtom, updatedAccount);
});

export const removeAccountAtom = atom(null, (get, set, id: number) => {
  const accs = get(accountsAtom);

  if (!accs) {
    throw new Error('accountsAtom is not initialized');
  }

  const newArray = accs.filter((acc) => acc.id !== id);
  set(accountsAtom, newArray);

  // Reset the selectedAccountAtom
  set(selectedAccountAtom, null);
});
