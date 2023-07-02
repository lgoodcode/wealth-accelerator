import { atom } from 'jotai';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

export const triggerSyncAtom = atom(false);

export const updateModeAtom = atom(false);

export const isInsItemIdSyncingOrLoadingAtom = atom<string | null>(null);

export const institutionsAtom = atom<ClientInstitution[]>([]);

export const selectedInstitutionAtom = atom<ClientInstitution | null>(null);

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
