export declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      /**
       * To determine if the build is happneing in the CI to prevent errors when
       * some env variables are not set
       */
      CircleCI: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      SUPABASE_PROJECT_ID: string;
      SENTRY_PROJECT: string;
      SENTRY_ORG: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      SENTRY_AUTH_TOKEN: string;
      PLAID_ENV: string;
      PLAID_CLIENT_NAME: string;
      PLAID_CLIENT_ID: string;
      PLAID_URL: string;
      PLAID_SECRET: string;
      PLAID_VERSION: string;
      PLAID_REDIRECT_URI: string;
      PLAID_WEBHOOK_URI: string;
      SMTP2GO_API_KEY: string;
      SMTP2GO_API_URL: string;
      EMAIL_SENDER: string;
      CCF_RECORD_TEMPLATE: string;
    }
  }

  /** Supabase user */
  export type User = {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    created_at: string;
    updated_at: string;
  };

  export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}
