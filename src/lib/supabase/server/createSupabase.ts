import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '../database';

/**
 * For the webhook route, there is not a Supabase session cookie, so we need to use the service role key
 * to create an admin Supabase client to have full access to the database to update any users' data.
 */
export const createSupabase = (admin?: boolean) => {
  if (admin) {
    return createServerComponentClient<Database>(
      { cookies },
      {
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    );
  }

  return createServerComponentClient<Database>({ cookies });
};

export type SupabaseServer = ReturnType<typeof createSupabase>;
