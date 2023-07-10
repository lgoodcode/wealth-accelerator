'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { usersAtom } from '../atoms';
import { UsersTable } from './table/users-table';

interface FiltersProps {
  usersData: User[];
}

export function Users({ usersData }: FiltersProps) {
  const [users, setUsers] = useAtom(usersAtom);

  useEffect(() => {
    setUsers(usersData);
  }, []);

  return (
    <div className="flex justify-center">
      <UsersTable users={users} />
    </div>
  );
}
