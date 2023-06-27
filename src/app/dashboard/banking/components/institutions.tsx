import { InstitutionSelection } from './institution-selection';
import type { Institution } from '@/lib/plaid/types/institutions';

interface InstitutionsProps {
  institutions: Institution[];
}

export function Institutions({ institutions }: InstitutionsProps) {
  return (
    <div className="flex w-full h-20 items-center">
      <InstitutionSelection institutions={institutions} />
    </div>
  );
}
