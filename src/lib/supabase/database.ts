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
      creative_cash_flow: {
        Row: {
          id: string
          user_id: string
        }
        Insert: {
          id: string
          user_id: string
        }
        Update: {
          id?: string
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
        Relationships: [
          {
            foreignKeyName: "creative_cash_flow_inputs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "creative_cash_flow_results_user_id_fkey"
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
          type: Database["public"]["Enums"]["account_type"]
        }
        Insert: {
          account_id: string
          enabled?: boolean
          item_id: string
          name: string
          type?: Database["public"]["Enums"]["account_type"]
        }
        Update: {
          account_id?: string
          enabled?: boolean
          item_id?: string
          name?: string
          type?: Database["public"]["Enums"]["account_type"]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "plaid_transactions_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "plaid_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "plaid_transactions_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "plaid"
            referencedColumns: ["item_id"]
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
          _start_date: string
          _end_date: string
          _all_other_income: number
          _payroll_and_distributions: number
          _lifestyle_expenses_tax_rate: number
          _tax_account_rate: number
          _optimal_savings_strategy: number
          _collections: number
          _lifestyle_expenses: number
          _lifestyle_expenses_tax: number
          _business_profit_before_tax: number
          _business_overhead: number
          _tax_account: number
          _waa: number
          _total_waa: number
          _weekly_trend: number[]
          _monthly_trend: number[]
          _yearly_trend: number[]
          _year_to_date: number
        }
        Returns: string
      }
      generate_rates: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          role: Database["public"]["Enums"]["user_role"]
          email_confirmed: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_creative_cash_flow_record: {
        Args: {
          record_id: string
        }
        Returns: {
          id: string
          inputs: Json
          results: Json
        }[]
      }
      get_creative_cash_flow_records: {
        Args: {
          arg_user_id: string
        }
        Returns: {
          id: string
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
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
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
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      total_waa_before_date: {
        Args: {
          user_id: string
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

