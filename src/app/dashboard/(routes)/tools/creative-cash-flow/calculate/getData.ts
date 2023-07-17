import { createSupabase, type SupabaseServer } from '@/lib/supabase/server/createSupabase';
import { Transaction } from '@/lib/plaid/types/transactions';

const getTransactions = async (supabase: SupabaseServer, user_id: string) => {
  // Get all of the users transactions data split into business and personal
  const { error: transactionsError, data: transactionsData } = await supabase.rpc(
    'get_transactions_by_user_id',
    { user_id }
  );

  if (transactionsError || !transactionsData) {
    throw transactionsError || new Error('No transactionsData returned');
  }

  return transactionsData as {
    business: Transaction[];
    personal: Transaction[];
  };
};

const getCollections = async (supabase: SupabaseServer, user_id: string) => {
  // Get the users year to date collections value to add to the Year to Date results
  const { error: collectionsError, data: collectionsData } = await supabase
    .from('personal_finance')
    .select('ytd_collections')
    .eq('user_id', user_id)
    .single();

  if (collectionsError || !collectionsData) {
    throw collectionsError || new Error('No collectionsData returned');
  }

  return collectionsData.ytd_collections;
};

export const getData = async (user_id: string) => {
  try {
    const supabase = createSupabase();
    const [transactions, ytd_collections] = await Promise.all([
      getTransactions(supabase, user_id),
      getCollections(supabase, user_id),
    ]);

    return {
      error: null,
      data: {
        transactions,
        ytd_collections,
      },
    };
  } catch (error) {
    return {
      error: error as Error,
      data: null,
    };
  }
};
