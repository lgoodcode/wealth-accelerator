import { createSupabase, type SupabaseServer } from '@/lib/supabase/server/create-supabase';
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
    .select('ytd_collections, default_tax_rate')
    .eq('user_id', user_id)
    .single();

  if (collectionsError || !collectionsData) {
    throw collectionsError || new Error('No collectionsData returned');
  }

  return collectionsData;
};

export const getData = async (user_id: string) => {
  try {
    const supabase = createSupabase();
    const [transactions, collections] = await Promise.all([
      getTransactions(supabase, user_id),
      getCollections(supabase, user_id),
    ]);

    return {
      error: null,
      data: {
        transactions,
        ytd_collections: collections.ytd_collections,
        default_tax_rate: collections.default_tax_rate,
      },
    };
  } catch (error) {
    return {
      error: error as Error,
      data: null,
    };
  }
};
