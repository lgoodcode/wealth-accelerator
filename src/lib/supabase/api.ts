import { cookies } from 'next/headers';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database';

export const createSupabase = () => {
  return createRouteHandlerClient<Database>({ cookies });
};
