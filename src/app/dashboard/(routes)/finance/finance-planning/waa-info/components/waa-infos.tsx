'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { WaaInfoTable } from './table/waa-info-table';
import { waaInfoAtom } from '../../atoms';
import type { WaaInfo } from '@/lib/types/waa-info';

interface WaaInfosProps {
  waaInfosData: WaaInfo[];
}

export function WaaInfos({ waaInfosData }: WaaInfosProps) {
  const [waaInfos, setWaaInfos] = useAtom(waaInfoAtom);

  useEffect(() => {
    setWaaInfos(waaInfosData);
  }, []);

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full">
        <CardContent>
          {!waaInfos ? <Loading className="mt-0 py-32" /> : <WaaInfoTable users={waaInfos} />}
        </CardContent>
      </Card>
    </div>
  );
}
