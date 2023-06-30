import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '../database';

export const createSupabase = () => createServerComponentClient<Database>({ cookies });

export type SupabaseServer = ReturnType<typeof createSupabase>;
