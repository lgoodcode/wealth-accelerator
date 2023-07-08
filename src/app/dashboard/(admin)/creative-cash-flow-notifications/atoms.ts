import { atom } from 'jotai';

import type { Notifier } from './types';

export const notifiersAtom = atom<Notifier[]>([]);

export const addNotifierAtom = atom(null, (_get, set, notifier: Notifier) => {
  set(notifiersAtom, (notifiers) => [...notifiers, notifier]);
});

export const updateNotifiersAtom = atom(null, (_get, set, updatedNotifier: Notifier) => {
  set(notifiersAtom, (notifiers) =>
    notifiers.map((notifier) => (notifier.id === updatedNotifier.id ? updatedNotifier : notifier))
  );
});

export const removeNotifierAtom = atom(null, (_get, set, id: number) => {
  set(notifiersAtom, (notifiers) => notifiers.filter((notifier) => notifier.id !== id));
});
