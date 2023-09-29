'use client';

import Image from 'next/image';

import { useUser } from '@/hooks/use-user';
import { isAdmin } from '@/lib/utils/is-admin';
import { Nav } from './nav';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';

interface HeaderProps {
  height: number;
}

export function Header({ height }: HeaderProps) {
  const user = useUser();

  return (
    <div
      className="flex flex-col md:flex shadow-md dark:shadow-white-sm"
      style={{
        height,
      }}
    >
      <div className="border-b">
        <div className="relative flex h-16 px-4 justify-between items-center">
          <Image src="/img/logo-318x85.png" alt="logo" priority width={160} height={43} />

          <Nav className="mx-4" isAdmin={user ? isAdmin(user) : false} />

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
