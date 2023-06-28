import { ManageInstitutions } from './manage-institutions';
import { ViewInstitutions } from './view-institutions';
import type { ClientInstitution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutions: ClientInstitution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  return (
    <>
      <ManageInstitutions institutions={institutions} />
      <ViewInstitutions institutions={institutions} />
    </>
  );
}
