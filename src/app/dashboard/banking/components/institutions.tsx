'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { institutionsAtom, isInstitutionsSyncingOrLoadingAtom } from '@/lib/atoms/institutions';
import { Loading } from '@/components/loading';
import { ManageInstitutions } from './manage-institutions';
import { ViewInstitutions } from './view-institutions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  // const [institutions, setInstitutions] = useAtom(institutionsAtom);
  const [isInstitutionsSyncingOrLoading] = useAtom(isInstitutionsSyncingOrLoadingAtom);

  // useEffect(() => {
  //   console.log('set');
  //   setInstitutions(_institutions);
  // }, [_institutions, setInstitutions]);

  return (
    <div className="flex flex-col gap-4">
      <ManageInstitutions institutions={institutions} />
      <ViewInstitutions institutions={institutions} />
      {isInstitutionsSyncingOrLoading && <Loading />}
    </div>
  );
}
