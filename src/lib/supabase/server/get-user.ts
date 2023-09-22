import { captureException, setUser } from '@sentry/nextjs';

import { createSupabase } from './create-supabase';
import { parseAuthCookie } from './parse-auth-cookie';

/**
 * Used in server components to retrieve the user from the Supabase server using the current auth cookie.
 *
 * If the cookie is invalid, it will be destroyed and the user will be redirected to the login page.
 */
export const getUser = async (): Promise<User | null> => {
  const supabase = createSupabase();
  // Parse the auth cookie and redirect to login if it's invalid
  const authToken = parseAuthCookie();

  if (!authToken) {
    return null;
  }

  const { error, data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authToken.sub)
    .single();

  if (error) {
    console.error(error);
    // Add the auth token to the error so we can debug it
    captureException(error, {
      extra: { authToken },
    });
  }

  if (error || !user) {
    return null;
  }

  // Ensure the user is set in Sentry for error reporting purposes for all server components and API routes
  setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });

  return user;
};
