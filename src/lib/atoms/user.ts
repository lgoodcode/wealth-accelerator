import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);

export const updateUserAtom = atom(null, (_get, set, user: User) => {
  set(userAtom, user);
});
