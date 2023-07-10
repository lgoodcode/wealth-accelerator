'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { institutionsAtom } from '@/lib/plaid/atoms';
import { ManageInstitutions } from './manage-institutions';
import { ViewInstitutions } from './view-institutions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  const setInstitutions = useSetAtom(institutionsAtom);

  useEffect(() => {
    setInstitutions(institutions);
  }, []);

  return (
    <div className="flex flex-col mt-6">
      <ManageInstitutions />
      <ViewInstitutions />
    </div>
  );
}
