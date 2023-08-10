'use client';

import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { setUser as setSentryUser } from '@sentry/nextjs';

import { userAtom } from '@/lib/atoms/user';

interface UserProviderProps {
  user: User;
  children: React.ReactNode;
}

// This component is used to sync the user data from the server to the client
// and set the Sentry user context.
export function UserProvider({ user, children }: UserProviderProps) {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    setUser(user);

    setSentryUser({
      id: user.id,
      username: user.name,
    });
  }, [user]);

  return <>{children}</>;
}
