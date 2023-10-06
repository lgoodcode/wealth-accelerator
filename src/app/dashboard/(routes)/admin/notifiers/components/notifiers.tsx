'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { notifiersAtom } from '../atoms';
import { NotifiersTable } from './table/notifiers-table';
import type { Notifier } from '@/lib/types';

interface NotifiersProps {
  notifiersData: Notifier[];
}

export function Notifiers({ notifiersData }: NotifiersProps) {
  const [notifiers, setNotifiers] = useAtom(notifiersAtom);

  useEffect(() => {
    setNotifiers(notifiersData);
  }, []);

  if (!notifiers) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full mt-8">
        <CardContent>
          <NotifiersTable notifiers={notifiers} />
        </CardContent>
      </Card>
    </div>
  );
}
