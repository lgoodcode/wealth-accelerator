import { createClient } from '@supabase/supabase-js';

/**
 * This uses the service role key and should only be used for server-side calls
 * that require admin access when the user making the request is not an admin.
 * i.e. bypass RLS policies
 *
 * An example is for when a user is sharing a CCF record. The notifiers table is only
 * accessible for admins to manage, but the user should be able to share the record
 * with the notifiers. This is done on the server but because the Supabase NextJS helpers
 * use the user's JWT, it takes precedence over the service role key.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
