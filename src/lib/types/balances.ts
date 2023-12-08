import type { Database } from '@/lib/supabase/database';

export type BalancesAccount = Database['public']['Tables']['balances_accounts']['Row'];
export type InsertBalancesAccount = Database['public']['Tables']['balances_accounts']['Insert'];
export type UpdateBalancesAccount = Database['public']['Tables']['balances_accounts']['Update'];

export type BalancesEntry = Database['public']['Tables']['balances_entries']['Row'];
export type InsertBalancesEntry = Database['public']['Tables']['balances_entries']['Insert'];
export type UpdateBalancesEntry = Database['public']['Tables']['balances_entries']['Update'];
export type BalancesEntryData = Omit<BalancesEntry, 'account_id'>;
