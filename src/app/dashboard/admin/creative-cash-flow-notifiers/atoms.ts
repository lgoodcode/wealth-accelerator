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

export const updateNotifierAtom = atom(null, (_get, set, updatedNotifier: Notifier) => {
  set(notifiersAtom, (notifiers) => {
    if (!notifiers) {
      throw new Error('Notifiers do not exist');
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
      throw new Error('Notifiers do not exist');
    }

    return notifiers.filter((notifier) => notifier.id !== id);
  });
});
