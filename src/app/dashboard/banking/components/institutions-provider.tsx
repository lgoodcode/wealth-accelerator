'use client';

import { useAtom } from 'jotai';
import { institutionsAtom } from '../atoms';
import type { Institution } from '@/lib/plaid/types/institutions';

interface InstitutionsProviderProps {
  children: React.ReactNode;
  institutions: Institution[];
}

export function InstitutionsProvider({ children, institutions }: InstitutionsProviderProps) {
  const [, setInstitutions] = useAtom(institutionsAtom);
  console.log('provider institutions', institutions);
  setInstitutions(institutions);

  return <>{children}</>;
}
