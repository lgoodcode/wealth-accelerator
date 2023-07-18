export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      creative_cash_flow_inputs: {
        Row: {
          all_other_income: number
          created_at: string
          end_date: string
          id: string
          lifestyle_expenses_tax_rate: number
          optimal_savings_strategy: number
          payroll_and_distributions: number
          start_date: string
          tax_account_rate: number
          user_id: string
        }
        Insert: {
          all_other_income: number
          created_at?: string
          end_date: string
          id: string
          lifestyle_expenses_tax_rate: number
          optimal_savings_strategy: number
          payroll_and_distributions: number
          start_date: string
          tax_account_rate: number
          user_id: string
        }
        Update: {
          all_other_income?: number
          created_at?: string
          end_date?: string
          id?: string
          lifestyle_expenses_tax_rate?: number
          optimal_savings_strategy?: number
          payroll_and_distributions?: number
          start_date?: string
          tax_account_rate?: number
          user_id?: string
        }
      }
      creative_cash_flow_notifiers: {
        Row: {
          email: string
          enabled: boolean
          id: number
          name: string
        }
        Insert: {
          email: string
          enabled?: boolean
          id?: number
          name: string
        }
        Update: {
          email?: string
          enabled?: boolean
          id?: number
          name?: string
        }
      }
      creative_cash_flow_results: {
        Row: {
          business_overhead: number
          business_profit_before_tax: number
          collections: number
          id: string
          lifestyle_expenses: number
          lifestyle_expenses_tax: number
          monthly_trend: number[]
          tax_account: number
          total_waa: number
          user_id: string
          waa: number
          weekly_trend: number[]
          year_to_date: number
          yearly_trend: number[]
        }
        Insert: {
          business_overhead: number
          business_profit_before_tax: number
          collections: number
          id: string
          lifestyle_expenses: number
          lifestyle_expenses_tax: number
          monthly_trend: number[]
          tax_account: number
          total_waa: number
          user_id: string
          waa: number
          weekly_trend: number[]
          year_to_date: number
          yearly_trend: number[]
        }
        Update: {
          business_overhead?: number
          business_profit_before_tax?: number
          collections?: number
          id?: string
          lifestyle_expenses?: number
          lifestyle_expenses_tax?: number
          monthly_trend?: number[]
          tax_account?: number
          total_waa?: number
          user_id?: string
          waa?: number
          weekly_trend?: number[]
          year_to_date?: number
          yearly_trend?: number[]
        }
      }
      debts: {
        Row: {
          amount: number
          description: string
          id: number
          interest: number
          months_remaining: number
          payment: number
          user_id: string
        }
        Insert: {
          amount: number
          description: string
          id?: number
          interest: number
          months_remaining: number
          payment: number
          user_id: string
        }
        Update: {
          amount?: number
          description?: string
          id?: number
          interest?: number
          months_remaining?: number
          payment?: number
          user_id?: string
        }
      }
      personal_finance: {
        Row: {
          id: number
          money_needed_to_live: number
          premium_deposit: number
          rates: number[]
          start_date: string
          start_withdrawl: number
          stop_invest: number
          tax_bracket: number
          tax_bracket_future: number
          user_id: string
          ytd_collections: number
        }
        Insert: {
          id?: number
          money_needed_to_live?: number
          premium_deposit?: number
          rates?: number[]
          start_date?: string
          start_withdrawl?: number
          stop_invest?: number
          tax_bracket?: number
          tax_bracket_future?: number
          user_id: string
          ytd_collections?: number
        }
        Update: {
          id?: number
          money_needed_to_live?: number
          premium_deposit?: number
          rates?: number[]
          start_date?: string
          start_withdrawl?: number
          stop_invest?: number
          tax_bracket?: number
          tax_bracket_future?: number
          user_id?: string
          ytd_collections?: number
        }
      }
      plaid: {
        Row: {
          access_token: string
          cursor: string | null
          expiration: string
          item_id: string
          name: string
          user_id: string
        }
        Insert: {
          access_token: string
          cursor?: string | null
          expiration: string
          item_id: string
          name: string
          user_id: string
        }
        Update: {
          access_token?: string
          cursor?: string | null
          expiration?: string
          item_id?: string
          name?: string
          user_id?: string
        }
      }
      plaid_accounts: {
        Row: {
          account_id: string
          enabled: boolean
          item_id: string
          name: string
          type: string
        }
        Insert: {
          account_id: string
          enabled?: boolean
          item_id: string
          name: string
          type?: string
        }
        Update: {
          account_id?: string
          enabled?: boolean
          item_id?: string
          name?: string
          type?: string
        }
      }
      plaid_filters: {
        Row: {
          category: Database["public"]["Enums"]["category"]
          filter: string
          id: number
        }
        Insert: {
          category: Database["public"]["Enums"]["category"]
          filter: string
          id?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["category"]
          filter?: string
          id?: number
        }
      }
      plaid_transactions: {
        Row: {
          account_id: string
          amount: number
          category: Database["public"]["Enums"]["category"]
          date: string
          id: string
          item_id: string
          name: string
        }
        Insert: {
          account_id: string
          amount: number
          category: Database["public"]["Enums"]["category"]
          date: string
          id: string
          item_id: string
          name: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: Database["public"]["Enums"]["category"]
          date?: string
          id?: string
          item_id?: string
          name?: string
        }
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_creative_cash_flow_record: {
        Args: {
          record_id: string
        }
        Returns: undefined
      }
      generate_rates: {
        Args: Record<PropertyKey, never>
        Returns: number[]
      }
      get_creative_cash_flow_record: {
        Args: {
          record_id: string
        }
        Returns: {
          inputs: Json
          results: Json
        }[]
      }
      get_creative_cash_flow_records: {
        Args: {
          arg_user_id: string
        }
        Returns: {
          inputs: Json
          results: Json
        }[]
      }
      get_transactions_by_user_id: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      get_transactions_with_account_name: {
        Args: {
          ins_item_id: string
          offset_val: number
          limit_val: number
        }
        Returns: {
          id: string
          item_id: string
          account_id: string
          name: string
          amount: number
          category: Database["public"]["Enums"]["category"]
          date: string
          account: string
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_own_plaid_account: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_own_plaid_transaction: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      total_waa_before_date: {
        Args: {
          user_id: string
          target_date: string
        }
        Returns: number
      }
    }
    Enums: {
      account_type: "personal" | "business"
      category: "Transfer" | "Money-In" | "Money-Out"
      user_role: "USER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

