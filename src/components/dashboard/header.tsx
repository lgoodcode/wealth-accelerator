'use client'

import Image from 'next/image'

import { ThemeToggle } from '@/components/theme-toggle'
import { Nav } from './nav'
import { Search } from './search'
import TeamSwitcher from './team-switcher'
import { UserNav } from './user-nav'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex">
      <div className="border-b">
        <div className="relative flex h-16 items-center px-4">
          <div className="mr-4 px-3">
            <Image src="/img/title-logo.png" alt="logo" width={132} height={36} />
          </div>
          <TeamSwitcher />
          <Nav className="mx-4" />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Search />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}
