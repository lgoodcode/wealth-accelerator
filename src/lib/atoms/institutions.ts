import { atom } from 'jotai';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

export const isInsItemIdSyncingOrLoadingAtom = atom<string | null>(null);

export const institutionsAtom = atom<ClientInstitution[]>([]);

export const selectedInstitutionAtom = atom<ClientInstitution | null>(null);

export const setSelectedInstitutionAtom = atom(
  null,
  (
    get,
    set,
    update:
      | ClientInstitution
      | null
      | ((prev: ClientInstitution | null) => ClientInstitution | null)
  ) => {
    if (typeof update === 'function') {
      const currentInstitution = get(selectedInstitutionAtom);
      const updater = update as (prev: ClientInstitution | null) => ClientInstitution | null;
      const newInstitution = updater(currentInstitution);

      set(selectedInstitutionAtom, newInstitution);
    } else {
      set(selectedInstitutionAtom, update as ClientInstitution);
    }
  }
);

// export const updateInstitutionsAtom = atom(
//   null,
//   (get, set, updatedInstitution: ClientInstitution) => {
//     const array = get(institutionsAtom);
//     const index = array.findIndex((item) => item.item_id === updatedInstitution.item_id);
//     if (index >= 0) {
//       // Item exists, update it
//       const newArray = [...array];
//       newArray[index] = updatedInstitution;
//       set(institutionsAtom, newArray);
//     } else {
//       // Item does not exist, add it to the array
//       set(institutionsAtom, [...array, updatedInstitution]);
//     }
//   }
// );
