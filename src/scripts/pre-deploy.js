const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PROJECT_ID',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'PLAID_ENV',
  'PLAID_CLIENT_NAME',
  'PLAID_CLIENT_ID',
  'PLAID_URL',
  'PLAID_SECRET',
  'PLAID_VERSION',
  'PLAID_REDIRECT_URI',
  'PLAID_WEBHOOK_URI',
  'SMTP2GO_API_KEY',
  'SMPT2GO_API_URL',
  'EMAIL_SENDER',
  'CCF_RECORD_TEMPLATE',
];

// Skip checking environment variables if in local development or running on CI
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && !process.env.CI) {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not defined`);
    }

    console.log('✅', envVar, 'is defined');
  });
}
