import { useQuery } from '@tanstack/react-query';
import { captureException } from '@sentry/nextjs';

import { supabase } from '@/lib/supabase/client';
import type { Account } from '@/lib/plaid/types/institutions';

const CACHE_ACCOUNTS_FOR = 1000 * 60 * 60 * 24; // 1 day

const getAccounts = async (item_id: string) => {
  const { error, data } = await supabase
    .from('plaid_accounts')
    .select('*')
    .eq('item_id', item_id)
    .order('account_id', { ascending: true });

  if (error) {
    console.error(error);
    captureException(error);
  }

  return (data ?? []) as Account[];
};

export const useAccounts = (item_id: string) => {
  const {
    isError,
    isFetching,
    data: accounts = [],
  } = useQuery<Account[]>(['accounts', item_id], () => getAccounts(item_id), {
    staleTime: CACHE_ACCOUNTS_FOR,
  });

  return {
    isError,
    isFetching,
    accounts,
  };
};
