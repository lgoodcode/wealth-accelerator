'use client';

import { useAtomValue } from 'jotai';

import { insurancePolicyRowsAtom } from '../../atoms';
import { PolicyInputsForm } from './policy-inputs-form';
import { PolicySaveCard } from './policy-save-card';
import { PolicyTable } from './table/policy-table';
import type { InsuranceCompany } from '../../types';

interface CreateInsurancePolicyProps {
  users: {
    id: string;
    name: string;
  }[];
  companies: InsuranceCompany[];
}

export function CreateInsurancePolicy({ users, companies }: CreateInsurancePolicyProps) {
  const insurancePolicyRows = useAtomValue(insurancePolicyRowsAtom);

  return (
    <div className="flex w-full gap-6 mt-8">
      <div className="sticky flex flex-col w-[480px] h-fit top-8 gap-6">
        <PolicyInputsForm companies={companies} />
        <PolicySaveCard users={users} />
      </div>
      <div>
        <PolicyTable insurancePolicyRows={insurancePolicyRows} />
      </div>
    </div>
  );
}
