'use client';

import { Fragment } from 'react';
import { Users } from 'lucide-react';

import { useLogin } from '@/hooks/auth/use-login';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TestUser = {
  name: string;
  email: string;
  password: string;
};

const NUM_USERS = 16; // The number of test{n}@gmail.com users in the seed data
// Hard code the names for known tests users data
const USER_NAMES: Record<number, string> = {
  1: 'Lawrence Doe',
  7: 'Adam Doe',
  10: 'Roger Doe',
  15: 'Ken Doe',
};

const padNumber = (number: number) => {
  if (number >= 0 && number <= 9) {
    return '0' + number.toString();
  } else {
    return number.toString();
  }
};

const generateTestUsers = (): TestUser[] => {
  const users = [];

  for (let i = 1; i <= NUM_USERS; i++) {
    users.push({
      name: USER_NAMES[i] ?? `Test User ${i}`,
      email: `test${padNumber(i)}@gmail.com`,
      password: 'Password123$',
    });
  }

  return users;
};

const TestUsers = () => {
  const testUsers = generateTestUsers();
  const login = useLogin();

  const handleClick = async (user: TestUser) => {
    login({ email: user.email, password: user.password });
  };

  return (
    <div>
      {testUsers.map((user, i) => (
        <Fragment key={user.email}>
          <DropdownMenuItem onClick={() => handleClick(user)}>
            <div className="flex flex-col space-y-1">
              <p className="font-medium leading-none">{user.name}</p>
              <p className="text-sm truncate text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuItem>
          {i !== testUsers.length - 1 && <DropdownMenuSeparator />}
        </Fragment>
      ))}
    </div>
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
        <DropdownMenuContent className="w-64 h-[600px] overflow-y-auto" align="end">
          <TestUsers />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
