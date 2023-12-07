export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      balances_accounts: {
        Row: {
          id: number
          name: string
          user_id: string
        }
        Insert: {
          id?: number
          name: string
          user_id: string
        }
        Update: {
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balances_accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      balances_entries: {
        Row: {
          account_id: number
          amount: number
          date: string
          id: number
        }
        Insert: {
          account_id: number
          amount: number
          date: string
          id?: number
        }
        Update: {
          account_id?: number
          amount?: number
          date?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "balances_entries_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "balances_accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      creative_cash_flow: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_cash_flow_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      creative_cash_flow_inputs: {
        Row: {
          all_other_income: number
          end_date: string
          id: string
          lifestyle_expenses_tax_rate: number
          optimal_savings_strategy: number
          payroll_and_distributions: number
          start_date: string
          tax_account_rate: number
        }
        Insert: {
          all_other_income: number
          end_date: string
          id: string
          lifestyle_expenses_tax_rate: number
          optimal_savings_strategy: number
          payroll_and_distributions: number
          start_date: string
          tax_account_rate: number
        }
        Update: {
          all_other_income?: number
          end_date?: string
          id?: string
          lifestyle_expenses_tax_rate?: number
          optimal_savings_strategy?: number
          payroll_and_distributions?: number
          start_date?: string
          tax_account_rate?: number
        }
        Relationships: []
      }
      creative_cash_flow_results: {
        Row: {
          actual_waa: number | null
          business_overhead: number
          business_profit_before_tax: number
          collections: number
          daily_trend: number[]
          id: string
          lifestyle_expenses: number
          lifestyle_expenses_tax: number
          tax_account: number
          total_waa: number | null
          waa: number
          weekly_trend: number[]
          year_to_date: number
          yearly_trend: number[]
        }
        Insert: {
          actual_waa?: number | null
          business_overhead: number
          business_profit_before_tax: number
          collections: number
          daily_trend: number[]
          id: string
          lifestyle_expenses: number
          lifestyle_expenses_tax: number
          tax_account: number
          total_waa?: number | null
          waa: number
          weekly_trend: number[]
          year_to_date: number
          yearly_trend: number[]
        }
        Update: {
          actual_waa?: number | null
          business_overhead?: number
          business_profit_before_tax?: number
          collections?: number
          daily_trend?: number[]
          id?: string
          lifestyle_expenses?: number
          lifestyle_expenses_tax?: number
          tax_account?: number
          total_waa?: number | null
          waa?: number
          weekly_trend?: number[]
          year_to_date?: number
          yearly_trend?: number[]
        }
        Relationships: []
      }
      debt_snowball: {
        Row: {
          created_at: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          id: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          debts?: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debt_snowball_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      debt_snowball_inputs: {
        Row: {
          additional_payment: number
          id: string
          loan_interest_rate: number
          lump_amounts: number[]
          monthly_payment: number
          opportunity_rate: number
          pay_back_loan: boolean
          pay_interest: boolean
          strategy: string
        }
        Insert: {
          additional_payment: number
          id: string
          loan_interest_rate: number
          lump_amounts: number[]
          monthly_payment: number
          opportunity_rate: number
          pay_back_loan: boolean
          pay_interest: boolean
          strategy: string
        }
        Update: {
          additional_payment?: number
          id?: string
          loan_interest_rate?: number
          lump_amounts?: number[]
          monthly_payment?: number
          opportunity_rate?: number
          pay_back_loan?: boolean
          pay_interest?: boolean
          strategy?: string
        }
        Relationships: [
          {
            foreignKeyName: "debt_snowball_inputs_id_fkey"
            columns: ["id"]
            referencedRelation: "debt_snowball"
            referencedColumns: ["id"]
          }
        ]
      }
      debt_snowball_results: {
        Row: {
          current: Database["public"]["CompositeTypes"]["current_calculation_results"]
          id: string
          strategy: Database["public"]["CompositeTypes"]["strategy_calculation_results"]
        }
        Insert: {
          current: Database["public"]["CompositeTypes"]["current_calculation_results"]
          id: string
          strategy: Database["public"]["CompositeTypes"]["strategy_calculation_results"]
        }
        Update: {
          current?: Database["public"]["CompositeTypes"]["current_calculation_results"]
          id?: string
          strategy?: Database["public"]["CompositeTypes"]["strategy_calculation_results"]
        }
        Relationships: [
          {
            foreignKeyName: "debt_snowball_results_id_fkey"
            columns: ["id"]
            referencedRelation: "debt_snowball"
            referencedColumns: ["id"]
          }
        ]
      }
      debt_snowballs: {
        Row: {
          created_at: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          id: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          debts?: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debt_snowballs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          months_remaining?: number
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
        Relationships: [
          {
            foreignKeyName: "debts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      global_plaid_filters: {
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
        Relationships: []
      }
      notifiers: {
        Row: {
          contact_email: boolean
          creative_cash_flow: boolean
          debt_snowball: boolean
          email: string
          id: number
          name: string
        }
        Insert: {
          contact_email?: boolean
          creative_cash_flow?: boolean
          debt_snowball?: boolean
          email: string
          id?: number
          name: string
        }
        Update: {
          contact_email?: boolean
          creative_cash_flow?: boolean
          debt_snowball?: boolean
          email?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      personal_finance: {
        Row: {
          default_tax_rate: number
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
          default_tax_rate?: number
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
          default_tax_rate?: number
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
        Relationships: [
          {
            foreignKeyName: "personal_finance_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      plaid: {
        Row: {
          access_token: string
          cursor: string | null
          expiration: string
          item_id: string
          name: string
          new_accounts: boolean
          user_id: string
        }
        Insert: {
          access_token: string
          cursor?: string | null
          expiration: string
          item_id: string
          name: string
          new_accounts?: boolean
          user_id: string
        }
        Update: {
          access_token?: string
          cursor?: string | null
          expiration?: string
          item_id?: string
          name?: string
          new_accounts?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plaid_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      plaid_accounts: {
        Row: {
          account_id: string
          enabled: boolean
          item_id: string
          name: string
          type: Database["public"]["Enums"]["plaid_account_type"]
        }
        Insert: {
          account_id: string
          enabled?: boolean
          item_id: string
          name: string
          type: Database["public"]["Enums"]["plaid_account_type"]
        }
        Update: {
          account_id?: string
          enabled?: boolean
          item_id?: string
          name?: string
          type?: Database["public"]["Enums"]["plaid_account_type"]
        }
        Relationships: [
          {
            foreignKeyName: "plaid_accounts_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "plaid"
            referencedColumns: ["item_id"]
          }
        ]
      }
      plaid_transactions: {
        Row: {
          account_id: string
          amount: number
          category: Database["public"]["Enums"]["category"]
          date: string
          global_filter_id: number | null
          id: string
          item_id: string
          name: string
          user_filter_id: number | null
        }
        Insert: {
          account_id: string
          amount: number
          category: Database["public"]["Enums"]["category"]
          date: string
          global_filter_id?: number | null
          id: string
          item_id: string
          name: string
          user_filter_id?: number | null
        }
        Update: {
          account_id?: string
          amount?: number
          category?: Database["public"]["Enums"]["category"]
          date?: string
          global_filter_id?: number | null
          id?: string
          item_id?: string
          name?: string
          user_filter_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_transactions_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "plaid_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "plaid_transactions_global_filter_id_fkey"
            columns: ["global_filter_id"]
            referencedRelation: "global_plaid_filters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plaid_transactions_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "plaid"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "plaid_transactions_user_filter_id_fkey"
            columns: ["user_filter_id"]
            referencedRelation: "user_plaid_filters"
            referencedColumns: ["id"]
          }
        ]
      }
      user_plaid_filters: {
        Row: {
          category: Database["public"]["Enums"]["category"]
          filter: string
          id: number
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["category"]
          filter: string
          id?: number
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["category"]
          filter?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plaid_filters_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      waa: {
        Row: {
          amount: number
          date: string
          id: number
          user_id: string
        }
        Insert: {
          amount: number
          date: string
          id?: number
          user_id: string
        }
        Update: {
          amount?: number
          date?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waa_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      change_user_password: {
        Args: {
          current_password: string
          new_password: string
        }
        Returns: undefined
      }
      create_creative_cash_flow: {
        Args: {
          _user_id: string
          name: string
          inputs: unknown
          results: unknown
        }
        Returns: {
          id: string
          created_at: string
        }[]
      }
      create_debt_snowball_record: {
        Args: {
          user_id: string
          name: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          inputs: Database["public"]["CompositeTypes"]["debt_snowball_inputs_data"]
          results: Database["public"]["CompositeTypes"]["debt_snowball_results_data"]
        }
        Returns: {
          id: string
          created_at: string
        }[]
      }
      create_global_plaid_filter: {
        Args: {
          _filter: unknown
          override: boolean
        }
        Returns: {
          category: Database["public"]["Enums"]["category"]
          filter: string
          id: number
        }
      }
      create_user_plaid_filter: {
        Args: {
          _filter: unknown
          user_override: boolean
          global_override: boolean
        }
        Returns: {
          category: Database["public"]["Enums"]["category"]
          filter: string
          id: number
          user_id: string
        }
      }
      delete_global_plaid_filter: {
        Args: {
          filter_id: number
          new_filter_id?: number
        }
        Returns: undefined
      }
      delete_user_plaid_filter: {
        Args: {
          filter_id: number
          global_filter_id?: number
        }
        Returns: undefined
      }
      generate_rates: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_ccf_transactions_by_user_id: {
        Args: {
          user_id: string
        }
        Returns: {
          personal: Database["public"]["CompositeTypes"]["ccf_plaid_transaction"][]
          business: Database["public"]["CompositeTypes"]["ccf_plaid_transaction"][]
        }[]
      }
      get_creative_cash_flow_record: {
        Args: {
          record_id: string
        }
        Returns: {
          id: string
          name: string
          created_at: string
          inputs: Json
          results: Json
        }[]
      }
      get_creative_cash_flow_records: {
        Args: {
          _user_id: string
        }
        Returns: {
          id: string
          name: string
          created_at: string
          inputs: Json
          results: Json
        }[]
      }
      get_debt_snowball_record: {
        Args: {
          record_id: string
        }
        Returns: {
          id: string
          user_id: string
          name: string
          created_at: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          inputs: Json
          results: Json
        }[]
      }
      get_debt_snowball_records: {
        Args: {
          _user_id: string
        }
        Returns: {
          id: string
          user_id: string
          name: string
          created_at: string
          debts: Database["public"]["CompositeTypes"]["debt_snowball_debt"][]
          inputs: Json
          results: Json
        }[]
      }
      get_manage_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          role: Database["public"]["Enums"]["user_role"]
          confirmed_email: boolean
          created_at: string
          updated_at: string
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
      get_waa_account_id: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_id: string
          item_id: string
        }[]
      }
      is_admin:
        | {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
        | {
            Args: {
              user_id: string
            }
            Returns: boolean
          }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_email_used: {
        Args: {
          email: string
        }
        Returns: boolean
      }
      is_own_balances_entry: {
        Args: Record<PropertyKey, never>
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
      owns_creative_cash_flow: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_debt_snowball_inputs: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_debt_snowball_results: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      total_waa_before_date: {
        Args: {
          _user_id: string
          target_date: string
        }
        Returns: number
      }
      update_user_profile: {
        Args: {
          new_name: string
          new_email: string
        }
        Returns: Json
      }
    }
    Enums: {
      category: "Transfer" | "Money-In" | "Money-Out"
      plaid_account_type: "personal" | "business" | "waa"
      user_role: "USER" | "ADMIN"
    }
    CompositeTypes: {
      ccf_plaid_transaction: {
        id: string
        item_id: string
        name: string
        amount: number
        category: string
        date: string
      }
      current_calculation_results: {
        debt_payoffs: unknown
        balance_tracking: unknown
        interest_tracking: unknown
        payoff_months: number
        total_interest: number
        total_amount: number
      }
      debt_snowball_debt: {
        description: string
        amount: number
        payment: number
        interest: number
        months_remaining: number
      }
      debt_snowball_debt_payoff: {
        debt: Database["public"]["CompositeTypes"]["debt_snowball_debt_payoff_debt"]
        payment_tracking: unknown
      }
      debt_snowball_debt_payoff_debt: {
        description: string
      }
      debt_snowball_inputs_data: {
        additional_payment: number
        monthly_payment: number
        opportunity_rate: number
        strategy: string
        lump_amounts: unknown
        pay_back_loan: boolean
        pay_interest: boolean
        loan_interest_rate: number
      }
      debt_snowball_results_data: {
        current: Database["public"]["CompositeTypes"]["current_calculation_results"]
        strategy: Database["public"]["CompositeTypes"]["strategy_calculation_results"]
      }
      loan_payback_type: {
        total: number
        interest: number
        months: number
        tracking: unknown
      }
      strategy_calculation_results: {
        debt_payoffs: unknown
        balance_tracking: unknown
        interest_tracking: unknown
        payoff_months: number
        total_interest: number
        total_amount: number
        snowball_tracking: unknown
        loan_payback: Database["public"]["CompositeTypes"]["loan_payback_type"]
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
          version: string | null
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
          version?: string | null
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
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
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
        Returns: unknown
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

