import { atom } from 'jotai';

export const usersAtom = atom<User[] | null>(null);

export const updateUserAtom = atom(null, (_get, set, user: User) => {
  set(usersAtom, (users) => {
    if (!users) {
      throw new Error('usersAtom is not initialized');
    }

    const index = users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      throw new Error('User does not exist');
    }

    const newUsers = [...users];
    newUsers[index] = user;

    return newUsers;
  });
});

export const removeUserAtom = atom(null, (_get, set, id: string) => {
  set(usersAtom, (users) => {
    if (!users) {
      throw new Error('usersAtom is not initialized');
    }

    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new Error('User does not exist');
    }

    const newUsers = [...users];
    newUsers.splice(index, 1);

    return newUsers;
  });
});
