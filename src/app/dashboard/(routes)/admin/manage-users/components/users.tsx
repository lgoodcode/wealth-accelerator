'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { usersAtom } from '@/lib/atoms/users';
import { Loading } from '@/components/loading';
import { Card, CardContent } from '@/components/ui/card';
import { UsersTable } from './table/users-table';
import type { ManageUser } from '@/lib/types';

interface FiltersProps {
  usersData: ManageUser[] | null;
}

export function Users({ usersData }: FiltersProps) {
  const [users, setUsers] = useAtom(usersAtom);

  useEffect(() => {
    setUsers(usersData);
  }, []);

  return (
    <div className="flex justify-center mx-auto lg:w-[1024px]">
      <Card className="w-full mt-8">
        <CardContent>
          {users ? <Loading className="mt-0 py-32" /> : <UsersTable users={users} />}
        </CardContent>
      </Card>
    </div>
  );
}
