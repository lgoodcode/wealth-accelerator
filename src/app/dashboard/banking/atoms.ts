import { atom } from 'jotai';
import type { Institution } from '@/lib/plaid/types/institutions';

export const institutionsAtom = atom<Institution[]>([]);
export const selectedInstitutionAtom = atom<Institution | null>(null);
export const triggerSyncAtom = atom(false);
