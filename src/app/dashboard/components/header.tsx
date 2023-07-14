'use client';

import Link from 'next/link';
import Image from 'next/image';

import { isAdmin } from '@/lib/utils/isAdmin';
import { Nav } from './nav';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex shadow-md dark:shadow-white-md">
      <div className="border-b">
        <div className="relative flex h-16 justify-between items-center px-4">
          <Link href="/dashboard/home" className="px-3">
            <Image src="/img/logo-318x85.png" alt="logo" width={132} height={36} />
          </Link>

          <Nav className="mx-4" isAdmin={isAdmin(user)} />

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
