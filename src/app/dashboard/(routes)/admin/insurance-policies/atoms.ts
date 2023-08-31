import { atom } from 'jotai';

import type { UserInsurancePolicyView, InsurancePolicyRow } from './types';

export const userInsurancePolicyViewsAtom = atom<UserInsurancePolicyView[] | null>(null);

export const insurancePolicyRowsAtom = atom<InsurancePolicyRow[]>([]);

// Remove the remove and update the rows to decrement the years and age that proceed
// the row being removed
export const removeInsurancePolicyRowAtom = atom(null, (get, set, rowId: number) => {
  const rows = get(insurancePolicyRowsAtom);

  set(
    insurancePolicyRowsAtom,
    rows
      .filter((row) => row.id !== rowId)
      .map((row) => {
        if (row.id > rowId) {
          return {
            ...row,
            age: row.age_end_year - 1,
            years: row.year - 1,
          };
        }

        return row;
      })
  );
});

export const newPolicyCompanyIdAtom = atom<number>(-1);
