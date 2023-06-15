const requiredEnvVars = [
  'SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
]

// Skip checking environment variables if running on CI
if (!process.env.CI) {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not defined`)
    }

    console.log('✅', envVar, 'is defined')
  })
}
