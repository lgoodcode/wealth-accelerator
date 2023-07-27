import { atom } from 'jotai';
import { UserInsurancePolicies, UserInsurancePolicyView } from './types';

export const userInsurancePolicyViewsAtom = atom<UserInsurancePolicyView[] | null>(null);

export const usersInsurancePoliciesAtom = atom<UserInsurancePolicies[] | null>(null);
