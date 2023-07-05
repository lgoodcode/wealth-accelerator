'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { institutionsAtom } from '@/lib/atoms/institutions';
import { ManageInstitutions } from './manage-institutions';
import { ViewInstitutions } from './view-institutions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  const [institutionsData, setInstitutions] = useAtom(institutionsAtom);

  useEffect(() => {
    setInstitutions(institutions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <ManageInstitutions institutions={institutionsData} />
      <ViewInstitutions />
    </div>
  );
}
