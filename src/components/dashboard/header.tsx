'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Nav } from './nav'
import { Search } from './search'
import TeamSwitcher from './team-switcher'
import { UserNav } from './user-nav'

export function Header() {
  return (
    <div className="flex flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <Nav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  )
}
