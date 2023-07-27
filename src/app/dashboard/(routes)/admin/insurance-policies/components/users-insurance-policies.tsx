'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { userInsurancePolicyViewsAtom } from '../atoms';
import { UsersInsurancePoliciesTable } from './table/users-insurance-policies-table';
import type { UserInsurancePolicyView } from '../types';

interface UsersInsurancePoliciesProps {
  data: UserInsurancePolicyView[];
}

export function UsersInsurancePolicies({ data }: UsersInsurancePoliciesProps) {
  const [usersInsurancePolicyViews, setUsersInsurancePolicyViews] = useAtom(
    userInsurancePolicyViewsAtom
  );

  useEffect(() => {
    setUsersInsurancePolicyViews(data);
  }, []);

  if (!usersInsurancePolicyViews) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      {/* <UsersInsurancePoliciesTable usersInsurancePolicyViews={usersInsurancePolicyViews} /> */}
    </div>
  );
}
