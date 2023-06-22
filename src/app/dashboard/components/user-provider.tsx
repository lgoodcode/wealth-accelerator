'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { userAtom } from '@/lib/atoms/user';

interface UserProviderProps {
  user: User;
  children: React.ReactNode;
}

// This component is used to sync the user data from the server to the client.
export function UserProvider({ user, children }: UserProviderProps) {
  const [currentUser, setUser] = useAtom(userAtom);

  useEffect(() => {
    if (currentUser !== user) {
      setUser(user);
    }
  }, [currentUser, setUser, user]);

  return <>{children}</>;
}
