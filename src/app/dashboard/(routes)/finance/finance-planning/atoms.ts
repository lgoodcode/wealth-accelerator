import { atom } from 'jotai';

import type { WaaInfo } from '@/lib/types/waa-info';

export const waaInfoAtom = atom<WaaInfo[] | null>(null);

export const addWaaInfoAtom = atom(null, (_get, set, newWaaInfo: WaaInfo) => {
  set(waaInfoAtom, (newWaaInfos) => {
    if (!newWaaInfos) {
      return [newWaaInfo];
    }

    return [...newWaaInfos, newWaaInfo];
  });
});

export const updateWaaInfoAtom = atom(null, (_get, set, updatedWaaInfo: WaaInfo) => {
  set(waaInfoAtom, (waaInfos) => {
    if (!waaInfos) {
      throw new Error('waaInfoAtom is not initialized');
    }

    const index = waaInfos.findIndex((waaInfo) => waaInfo.id === updatedWaaInfo.id);

    if (index === -1) {
      throw new Error('WaaInfo does not exist');
    }

    const newWaaInfos = [...waaInfos];
    newWaaInfos[index] = updatedWaaInfo;

    return newWaaInfos;
  });
});

export const removeWaaInfoAtom = atom(null, (_get, set, id: number) => {
  set(waaInfoAtom, (waaInfos) => {
    if (!waaInfos) {
      throw new Error('waaInfoAtom is not initialized');
    }

    const index = waaInfos.findIndex((waaInfo) => waaInfo.id === id);

    if (index === -1) {
      throw new Error('WaaInfo does not exist');
    }

    const newWaaInfos = [...waaInfos];
    newWaaInfos.splice(index, 1);

    return newWaaInfos;
  });
});
