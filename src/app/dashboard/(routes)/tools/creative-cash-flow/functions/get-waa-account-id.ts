import { createSupabase } from '@/lib/supabase/server/create-supabase';
import { CustomError } from '@/lib/utils/CustomError';

export const getWaaAccountId = async () => {
  const supabase = createSupabase();
  const { error: waaAccountError, data: account_id } = await supabase.rpc('get_waa_account_id');

  if (waaAccountError) {
    return {
      error: new CustomError(
        waaAccountError,
        waaAccountError.message === 'No WAA account found'
          ? 'NO_WAA_ACCOUNT'
          : 'MULTIPLE_WAA_ACCOUNTS'
      ).code,
      data: null,
    };
  }

  return {
    error: null,
    data: account_id,
  };
};
