import { atom } from 'jotai';

import { Debt } from '@/lib/types/debts';

export const isUpdateDialogOpenAtom = atom(false);

export const debtsAtom = atom<Debt[] | null>(null);

export const addDebtAtom = atom(null, (_get, set, newDebt: Debt) => {
  set(debtsAtom, (debts) => {
    if (!debts) {
      return [newDebt];
    }

    return [...debts, newDebt];
  });
});

export const updateDebtAtom = atom(null, (_get, set, updatedDebt: Debt) => {
  set(debtsAtom, (debts) => {
    if (!debts) {
      throw new Error('debtsAtom is not initialized');
    }

    const index = debts.findIndex((debt) => debt.id === updatedDebt.id);

    if (index === -1) {
      throw new Error('Debt does not exist');
    }

    const newDebts = [...debts];
    newDebts[index] = updatedDebt;

    return newDebts;
  });
});

export const removeDebtAtom = atom(null, (_get, set, id: number) => {
  set(debtsAtom, (debts) => {
    if (!debts) {
      throw new Error('debtsAtom is not initialized');
    }

    const index = debts.findIndex((debt) => debt.id === id);

    if (index === -1) {
      throw new Error('Debt does not exist');
    }

    const newDebts = [...debts];
    newDebts.splice(index, 1);

    return newDebts;
  });
});
