import { createSupabase } from '@/lib/supabase/server/createSupabase';
import type { Institution } from './types/institutions';

/**
 * Retrieves the institution item from the database using the item_id
 */
export const getItemFromItemId = async (item_id: string) => {
  const supabase = createSupabase();
  const { error, data } = await supabase.from('plaid').select('*').eq('item_id', item_id).single();

  if (error || !data) {
    return {
      error: error || new Error(`No data returned for item_id: ${item_id}`),
      data: null,
    };
  }

  return {
    error: null,
    data: data as Institution,
  };
};
