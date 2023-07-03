// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@latest';
import { errorResponse } from '../_shared/errorResponse.ts';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
  const jwt = req.headers.get('Authorization');

  if (!jwt) {
    return errorResponse(new Error('Missing jwt in authorization header'));
  }

  const {
    error: userError,
    data: { user },
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    const error = userError || new Error('User not found from token');
    console.error(error);
    return errorResponse(error);
  }

  const { error: userDataError, data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userDataError || !userData) {
    const error = userError || new Error('Failed to retrieve user data');
    console.error(error);
    return errorResponse(error);
  }

  return new Response('Success');
});
