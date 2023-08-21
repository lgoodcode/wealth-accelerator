'use client';

import { Fragment, useState } from 'react';
import { Users } from 'lucide-react';

import { useLogin } from '@/hooks/auth/use-login';
import { useSignUp } from '@/hooks/auth/use-signup';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Auth = 'login' | 'signup';

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

interface TestUserItemProps {
  user: TestUser;
  auth: Auth;
}

const TestUserItem = ({ user, auth }: TestUserItemProps) => {
  const login = useLogin();
  const signup = useSignUp();

  const handleClick = async () => {
    if (auth === 'login') {
      login({ email: user.email, password: user.password });
    } else {
      await signup({ name: user.name, email: user.email, password: user.password });
      login({ email: user.email, password: user.password });
    }
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      <div className="flex flex-col space-y-1">
        <p className="font-medium leading-none">{user.name}</p>
        <p className="text-sm truncate text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuItem>
  );
};

interface TestUsersProps {
  auth: Auth;
}

const TestUsers = ({ auth }: TestUsersProps) => {
  const testUsers = generateTestUsers();

  return (
    <div>
      {testUsers.map((user, i) => (
        <Fragment key={user.email}>
          <TestUserItem user={user} auth={auth} />
          {i !== testUsers.length - 1 && <DropdownMenuSeparator />}
        </Fragment>
      ))}
    </div>
  );
};

export function AuthHelper() {
  const [auth, setAuth] = useState<Auth>('login');

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
        <DropdownMenuContent className="w-64" align="end">
          <div className="flex px-4 py-2 items-center justify-around">
            <Label className="text-lg" htmlFor="login-switch">
              Login
            </Label>
            <Switch id="login-switch" value={auth} onCheckedChange={() => setAuth('login')} />
            <Label className="text-lg opacity-50 cursor-not-allowed" htmlFor="login-switch">
              Sign Up
            </Label>
          </div>
          <Separator className="my-2" />
          <TestUsers auth={auth} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
