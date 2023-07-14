'use client';

// import { useLogin } from '@/hooks/use-login';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface UserLoginItemProps {
  user: User;
}

export const UserLoginItem = ({ user }: UserLoginItemProps) => {
  // const login = useLogin();

  return (
    <DropdownMenuItem>
      <div className="flex flex-col space-y-2">
        <p className="font-medium leading-none">{user.name}</p>
        <p className="text-sm leading-none truncate text-muted-foreground">{user.email}</p>
      </div>
    </DropdownMenuItem>
  );
};
