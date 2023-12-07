import type { Database } from '@/lib/supabase/database';

export type BalancesAccount = Database['public']['Tables']['balances_accounts']['Row'];
export type InsertBalancesAccount = Database['public']['Tables']['balances_accounts']['Insert'];
export type UpdateBalancesAccount = Database['public']['Tables']['balances_accounts']['Update'];

export type BalancesEntry = Database['public']['Tables']['balances_entries']['Row'];
