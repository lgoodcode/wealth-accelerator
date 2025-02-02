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
        source: '/dashboard',
        destination: '/dashboard/home',
        permanent: true,
      },
      {
        source: '/dashboard/home',
        destination: '/dashboard/finance/banking',
        permanent: false,
      },
      {
        // Make sure this is in sync with the /dashboard/finance-planning/layout routes
        source: '/dashboard/finance/finance-planning',
        destination: '/dashboard/finance/finance-planning/finance-info',
        permanent: false,
      },
      {
        source: '/dashboard/creative-cash-flow/:path*',
        destination: '/dashboard/tools/creative-cash-flow/:path*',
        permanent: true,
      },
      {
        // Redirects the old build home page to the new home page
        source: '/statistics',
        destination: '/',
        permanent: true,
      },
      {
        // New path route structure
        source: '/dashboard/tools/creative-cash-flow/calculate',
        destination: '/dashboard/tools/creative-cash-flow',
        permanent: true,
      },
    ];
  },
  rewrites: async () => {
    // Rewrite the root path to /home so we can group the components
    return [
      {
        source: '/',
        destination: '/home',
      },
      {
        // Proxy /sentry to Sentry
        source: '/sentry/:path*',
        // If in CI, use a placeholder URL
        destination: process.env.CI
          ? '/sentry'
          : `https://${process.env.NEXT_PUBLIC_SENTRY_DSN.split('@')[1].split('/')[0]}/:path*`,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(
    {
      ...nextConfig,
      sentry: {
        tunnelRoute: '/sentry',
        hideSourceMaps: true,
        widenClientFileUpload: true,
      },
    },
    {
      silent: true,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }
  )
);
