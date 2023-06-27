import { captureException } from '@sentry/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { parseAuthCookie } from '@/lib/supabase/parseAuthCookie';
import { createSupabaseServer } from '@/lib/supabase/server';

/**
 * Used in server components to retrieve the user from the Supabase server using the current auth cookie.
 *
 * If the cookie is invalid, it will be destroyed and the user will be redirected to the login page.
 */
export const getUser = async (): Promise<User> => {
  const supabase = createSupabaseServer();
  // Parse the auth cookie and redirect to login if it's invalid
  const authToken = parseAuthCookie(cookies());

  if (!authToken) {
    redirect('/login');
  }

  const { error: errorUser, data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authToken.sub)
    .single();

  if (errorUser) {
    console.error('DashboardLayout error', errorUser);
    captureException(errorUser);
  }

  if (errorUser || !user) {
    redirect('/login');
  }

  return user;
};
