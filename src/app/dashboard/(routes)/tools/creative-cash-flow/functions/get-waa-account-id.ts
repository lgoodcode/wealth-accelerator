import { createSupabase } from '@/lib/supabase/server/create-supabase';

export const getWaaAccountId = async () => {
  const supabase = createSupabase();
  const { error: waaAccountError, data: account_id } = await supabase.rpc('get_waa_account_id');

  if (waaAccountError) {
    return {
      error: waaAccountError.message,
      data: null,
    };
  }

  return {
    error: null,
    data: account_id,
  };
};
