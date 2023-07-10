export declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      SUPABASE_PROJECT_ID: string;
      SENTRY_DSN: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      PLAID_ENV: string;
      PLAID_CLIENT_NAME: string;
      PLAID_CLIENT_ID: string;
      PLAID_URL: string;
      PLAID_SECRET: string;
      PLAID_VERSION: string;
      PLAID_REDIRECT_URI: string;
      PLAID_WEBHOOK_URI: string;
      SMPT2GO_API_KEY: string;
    }
  }

  export type Role = 'user' | 'admin';

  /** Supabase user */
  export type User = {
    id: string;
    email: string;
    name: string;
    role: Role;
    created_at: string;
    updated_at: string;
  };

  export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}
