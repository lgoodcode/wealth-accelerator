/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/home',
        permanent: true,
      },
      {
        // Make sure this is in sync with the /dashboard/personal-finance/layout routes
        source: '/dashboard/personal-finance',
        destination: '/dashboard/personal-finance/finance-info',
        permanent: false,
      },
      {
        source: '/dashboard/creative-cash-flow',
        destination: '/dashboard/creative-cash-flow/calculate',
        permanent: true,
      },
      {
        source: '/dashboard/creative-cash-flow-records/:path*',
        destination: '/dashboard/creative-cash/records/:path*',
        permanent: false,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        // Proxy /sentry to Sentry
        source: '/sentry/:path*',
        // If in CI, use a placeholder URL
        destination: process.env.CI
          ? '/sentry'
          : `https://${process.env.SENTRY_DSN.split('@')[1].split('/')[0]}/:path*`,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(
    nextConfig,
    {
      silent: true,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
    { hideSourcemaps: true, tunnelRoute: '/sentry' }
  )
);
