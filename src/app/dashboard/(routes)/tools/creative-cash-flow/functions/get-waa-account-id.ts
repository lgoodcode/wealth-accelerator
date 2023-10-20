import { supabase } from '@/lib/supabase/client';
import { CustomError } from '@/lib/utils/CustomError';

export const getWaaAccountId = async () => {
  const { error: waaAccountError, data: waa } = await supabase.rpc('get_waa_account_id').single();

  if (waaAccountError) {
    if (waaAccountError.message === 'No WAA account found') {
      return {
        error: new CustomError(waaAccountError, 'NO_WAA_ACCOUNT'),
        data: null,
      };
    } else if (waaAccountError.message === 'Multiple WAA accounts found') {
      return {
        error: new CustomError(waaAccountError, 'MULTIPLE_WAA_ACCOUNTS'),
        data: null,
      };
    } else {
      return {
        error: new CustomError(waaAccountError),
        data: null,
      };
    }
  }

  return {
    error: null,
    data: waa,
  };
};
