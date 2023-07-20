'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Loading } from '@/components/loading';
import { usersAtom } from '../atoms';
import { UsersTable } from './table/users-table';

interface FiltersProps {
  usersData: User[] | null;
}

export function Users({ usersData }: FiltersProps) {
  const [users, setUsers] = useAtom(usersAtom);

  useEffect(() => {
    setUsers(usersData);
  }, []);

  if (!users) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <UsersTable users={users} />
    </div>
  );
}
