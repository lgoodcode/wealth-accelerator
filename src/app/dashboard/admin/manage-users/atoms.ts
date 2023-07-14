import { atom } from 'jotai';

export const usersAtom = atom<User[] | null>(null);

export const removeUserAtom = atom(null, (_get, set, id: string) => {
  set(usersAtom, (users) => {
    if (!users) {
      throw new Error('usersAtom is not initialized');
    }

    return users?.filter((user) => user.id !== id) ?? null;
  });
});
