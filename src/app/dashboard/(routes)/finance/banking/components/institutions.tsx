'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { institutionsAtom } from '@/lib/plaid/atoms';
import { Loading } from '@/components/loading';
import { ManageInstitutions } from './manage-institutions';
import { ViewInstitutions } from './view-institutions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutionsData: ClientInstitution[] | null;
}

export function Institutions({ institutionsData }: InstitutionsProps) {
  const [institutions, setInstitutions] = useAtom(institutionsAtom);

  useEffect(() => {
    if (institutionsData) {
      setInstitutions(institutionsData);
    }
  }, []);

  if (!institutions) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col mt-6 justify-center mx-auto lg:w-[1280px]">
      <ManageInstitutions />
      <ViewInstitutions />
    </div>
  );
}
