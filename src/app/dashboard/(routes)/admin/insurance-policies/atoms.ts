import { atom } from 'jotai';

import type { UserInsurancePolicyView, InsurancePolicyRow } from './types';

export const userInsurancePolicyViewsAtom = atom<UserInsurancePolicyView[] | null>(null);

export const insurancePolicyRowsAtom = atom<InsurancePolicyRow[]>([]);

export const newPolicyCompanyIdAtom = atom<number>(-1);
