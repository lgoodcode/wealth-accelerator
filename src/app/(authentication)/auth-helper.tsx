'use client';

import { Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogin } from './login/use-login';

type TestUser = {
  name: string;
  email: string;
  password: string;
};

export const testUsers: TestUser[] = [
  {
    name: 'Lawrence Good',
    email: 'lawrence.good55@gmail.com',
    password: 'Lawrence55$',
  },
  {
    name: 'John Doe',
    email: 'test@gmail.com',
    password: 'Lawrence55$',
  },
];

interface UserLoginItemProps {
  user: TestUser;
}

export const UserLoginItem = ({ user }: UserLoginItemProps) => {
  const login = useLogin();
  const handleLogin = () => {
    login({ email: user.email, password: user.password });
  };

  return (
    <DropdownMenuItem onClick={handleLogin}>
      <div className="flex flex-col space-y-2">
        <p className="font-medium leading-none">{user.name}</p>
        <p className="text-sm leading-none truncate text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuItem>
  );
};

export function AuthHelper() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-1 right-1 z-50 flex items-center justify-center rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-14 h-14 rounded-full">
            <span className="sr-only">Auth helper</span>
            <div className="block p-1">
              <Users />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          {testUsers?.map((user, i) => (
            <>
              <UserLoginItem user={user} />
              {i !== testUsers.length - 1 && <DropdownMenuSeparator />}
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
