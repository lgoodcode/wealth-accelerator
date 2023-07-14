'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { notifiersAtom } from '../atoms';
import { NotifiersTable } from './table/notifiers-table';
import type { Notifier } from '../types';

interface NotifiersProps {
  notifiersData: Notifier[];
}

export function Notifiers({ notifiersData }: NotifiersProps) {
  const [notifiers, setNotifiers] = useAtom(notifiersAtom);

  useEffect(() => {
    setNotifiers(notifiersData);
  }, []);

  return (
    <div className="flex justify-center">
      <NotifiersTable notifiers={notifiers} />
    </div>
  );
}
