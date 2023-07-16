'use client';

import { useRouter } from 'next/navigation';
import { setUser as setSentryUser } from '@sentry/nextjs';
import { LogOut, User } from 'lucide-react';

import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserNavProps {
  user: User | null;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  // If the user only has one name, use the first two letters of that name as the profile letters.
  // Otherwise, use the first letter of the first and last name.
  const profileLetters = !user
    ? ''
    : user.name.includes(' ')
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((name) => name[0])
        .join('')
    : user.name.slice(0, 2);

  // On logout, clear the Sentry user context and redirect to the login page.
  const logout = async () => {
    setSentryUser(null);
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative text-sm px-2.5 w-9 h-9 rounded-full border-primary border"
        >
          {profileLetters.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="font-medium leading-none">{user?.name}</p>
            <p className="text-sm leading-none truncate text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <User className="mr-2 h-5 w-5" />
            <span>Profile</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-5 w-5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
