'use client';

import { ManageInstitutions } from './manage-institutions';
import { ViewInstitutions } from './view-institutions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  return (
    <div className="flex flex-col">
      <ManageInstitutions institutions={institutions} />
      <ViewInstitutions />
    </div>
  );
}
