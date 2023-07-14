import { Users } from 'lucide-react';

import { createSupabase } from '@/lib/supabase/server/createSupabase';
import { Button } from '@/components/ui/button';
import { UserLoginItem } from './user-login-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export async function AuthHelper() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const supabase = createSupabase(true);
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });

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
          {users?.map((user, i) => (
            <>
              <UserLoginItem user={user} />
              {i !== users.length - 1 && <DropdownMenuSeparator />}
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
