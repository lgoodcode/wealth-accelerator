'use client';

import { Fragment, useState } from 'react';
import { Users } from 'lucide-react';

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
import { useLogin } from './login/use-login';
import { useSignUp } from './signup/use-signup';

type Auth = 'login' | 'signup';

type TestUser = {
  name: string;
  email: string;
  password: string;
};

const TEST_USERS: TestUser[] = JSON.parse(process.env.NEXT_PUBLIC_TEST_USERS || '[]');

interface UserLoginItemProps {
  user: TestUser;
  auth: Auth;
  disabled: boolean;
}

const TestUserItem = ({ user, auth, disabled }: UserLoginItemProps) => {
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
    <DropdownMenuItem disabled={disabled} onClick={handleClick}>
      <div className="flex flex-col space-y-1">
        <p className="font-medium leading-none">{user.name}</p>
        <p className="text-sm truncate text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuItem>
  );
};

const isDisabled = (auth: Auth, user: TestUser, emails: string[]) => {
  if (auth === 'signup') {
    return emails.includes(user.email);
  }

  return !emails.includes(user.email);
};

interface TestUsersProps {
  auth: Auth;
  devEmails: string[];
}

const TestUsers = ({ auth, devEmails }: TestUsersProps) => {
  if (!TEST_USERS.length) {
    return <div className="p-4">No users</div>;
  }

  return (
    <div>
      {TEST_USERS.map((user, i) => (
        <Fragment key={user.email}>
          <TestUserItem user={user} auth={auth} disabled={isDisabled(auth, user, devEmails)} />
          {i !== TEST_USERS.length - 1 && <DropdownMenuSeparator />}
        </Fragment>
      ))}
    </div>
  );
};

interface AuthHelperProps {
  devEmails: string[];
}

export function AuthHelper({ devEmails }: AuthHelperProps) {
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
            <Switch
              id="login-switch"
              value={auth}
              onCheckedChange={(checked) => setAuth(!checked ? 'login' : 'signup')}
            />
            <Label className="text-lg" htmlFor="login-switch">
              Sign Up
            </Label>
          </div>
          <Separator className="my-2" />
          <TestUsers auth={auth} devEmails={devEmails} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
