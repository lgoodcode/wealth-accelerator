import { atom } from 'jotai';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

export const updateModeAtom = atom(false);

/**
 * Set the item_id of an institution to know it's syncing or loading data and is used
 * to show a loading indicator on the institution selection item.
 */
export const isInsItemIdSyncingOrLoadingAtom = atom<string | null>(null);

export const institutionsAtom = atom<ClientInstitution[]>([]);

// Adds a newly connected institution to the institutions array
export const addInstitutionAtom = atom(null, (get, set, newInstitution: ClientInstitution) => {
  const array = get(institutionsAtom);
  set(institutionsAtom, [...array, newInstitution]);
});

export const updateInstitutionsAtom = atom(
  null,
  (get, set, updatedInstitution: ClientInstitution) => {
    const array = get(institutionsAtom);
    const index = array.findIndex((item) => item.item_id === updatedInstitution.item_id);
    if (index >= 0) {
      // Item exists, update it
      const newArray = [...array];
      newArray[index] = updatedInstitution;
      set(institutionsAtom, newArray);
    } else {
      // Item does not exist, add it to the array
      set(institutionsAtom, [...array, updatedInstitution]);
    }
  }
);

export const removeInstitutionAtom = atom(null, (get, set, itemId: string) => {
  const array = get(institutionsAtom);
  const newArray = array.filter((institution) => institution.item_id !== itemId);
  set(institutionsAtom, newArray);

  // Reset the selectedInstitutionIndexAtom
  set(selectedInstitutionIndexAtom, null);
});

// This atom stores the index of the selected institution
export const selectedInstitutionIndexAtom = atom<number | null>(null);

// This atom derives its value from institutionsAtom and selectedInstitutionIndexAtom
export const selectedInstitutionAtom = atom<ClientInstitution | null>((get) => {
  const index = get(selectedInstitutionIndexAtom);
  const institutions = get(institutionsAtom);
  return index !== null ? institutions[index] : null;
});

/**
 * Updates the selected institution atom. Can be passed null to clear the selected institution,
 * a new institution to set the selected institution, or a function that takes the current
 * selected institution and returns a new selected institution.
 */
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
    let newInstitution: ClientInstitution | null;

    if (typeof update === 'function') {
      const currentInstitution = get(selectedInstitutionAtom);
      const updater = update as (prev: ClientInstitution | null) => ClientInstitution | null;
      newInstitution = updater(currentInstitution);
    } else {
      newInstitution = update as ClientInstitution;
    }

    const institutions = get(institutionsAtom);
    const index = institutions.findIndex((institution) => institution === newInstitution);
    set(selectedInstitutionIndexAtom, index);
  }
);
