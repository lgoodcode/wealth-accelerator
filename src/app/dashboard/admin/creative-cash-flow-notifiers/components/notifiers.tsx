'use client';

import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { notifiersAtom } from '../atoms';
import { NotifiersTable } from './table/notifiers-table';
import type { Notifier } from '../types';

interface NotifiersProps {
  notifiersData: Notifier[];
}

export function Notifiers({ notifiersData }: NotifiersProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [notifiers, setNotifiers] = useAtom(notifiersAtom);

  useEffect(() => {
    console.log('useEffect');
    if (!isMounted) {
      console.log('set');
      setNotifiers(notifiersData);
    }
  }, [isMounted]);

  return <NotifiersTable notifiers={notifiers} />;
}
