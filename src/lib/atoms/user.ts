import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);

export const updateUserAtom = atom(null, (_get, set, user: User) => {
  set(userAtom, (prev) => {
    if (prev) {
      return {
        ...prev,
        ...user,
      };
    }

    return user;
  });
});

export const updateUserNameAndEmailAtom = atom(
  null,
  (_get, set, user: Pick<User, 'name' | 'email'>) => {
    set(userAtom, (prev) => {
      if (!prev) {
        throw new Error('User is not initialized');
      }

      return {
        ...prev,
        name: user.name,
        email: user.email,
      };
    });
  }
);

export const clearUserAtom = atom(null, (_get, set) => {
  set(userAtom, null);
});
