import { atom } from 'jotai';

import type { Notifier } from './types';

export const notifiersAtom = atom<Notifier[] | null>(null);

export const addNotifierAtom = atom(null, (_get, set, notifier: Notifier) => {
  set(notifiersAtom, (notifiers) => {
    if (!notifiers) {
      return [notifier];
    }

    return [...notifiers, notifier];
  });
});

// Takes a Notifier and checks if the email is already in the list of notifiers and returns a boolean
export const hasNotifierAtom = atom(null, (get, _set, email: string) => {
  const notifiers = get(notifiersAtom) as Notifier[] | null;

  if (!notifiers) {
    return false;
  }

  return notifiers.some((n) => n.email === email);
});

export const updateNotifierAtom = atom(null, (_get, set, updatedNotifier: Notifier) => {
  set(notifiersAtom, (notifiers) => {
    if (!notifiers) {
      throw new Error('notifiersAtom is not initialized');
    }

    const index = notifiers.findIndex((notifier) => notifier.id === updatedNotifier.id);

    if (index === -1) {
      throw new Error('Notifier does not exist');
    }

    const newNotifiers = [...notifiers];
    newNotifiers[index] = updatedNotifier;

    return newNotifiers;
  });
});

export const removeNotifierAtom = atom(null, (_get, set, id: number) => {
  set(notifiersAtom, (notifiers) => {
    if (!notifiers) {
      throw new Error('notifiersAtom is not initialized');
    }

    return notifiers.filter((notifier) => notifier.id !== id);
  });
});
