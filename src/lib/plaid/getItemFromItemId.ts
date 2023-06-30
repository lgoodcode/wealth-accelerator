import { captureException } from '@sentry/nextjs';

import { createSupabase } from '@/lib/supabase/server/createSupabase';

export const getItemFromItemId = async (item_id: string) => {
  const supabase = createSupabase();
  const { error, data } = await supabase.from('plaid').select('*').eq('item_id', item_id).single();

  if (error || !data) {
    console.error(error);
    captureException(error);
    return null;
  }

  return data;
};
