import { atom } from 'jotai';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

export const isInstitutionsSyncingOrLoadingAtom = atom<boolean>(false);

export const institutionsAtom = atom<ClientInstitution[]>([]);

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
